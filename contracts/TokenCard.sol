// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Version: V0.5.0 - Batch XP claim with different amounts per card + TokenGame integration

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenCard is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public admins;
    mapping(uint256 => uint256) public xpByToken;
    
    // TokenGame contract that can assign XP
    address public gameContract;

    event TokenMinted(address indexed to, uint256 indexed tokenId, string uri);
    event TokenBatchMinted(address indexed to, uint256[] tokenIds, string[] uris);
    event TokenBurned(uint256 indexed tokenId);
    event XpClaimed(address indexed player, uint256[] tokenIds, uint256[] xpAmounts, uint256 totalXp);
    event XpAssigned(address indexed player, uint256[] tokenIds, uint256[] xpAmounts, uint256 totalXp);
    event TokenUriUpdated(uint256 indexed tokenId, string uri);
    event GameContractUpdated(address indexed gameContract);

    constructor(address admin1, address admin2) ERC721("TOKEN Card", "TCARD") Ownable(msg.sender) {
        admins[admin1] = true;
        admins[admin2] = true;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || owner() == msg.sender, "Not admin");
        _;
    }
    
    modifier onlyGame() {
        require(msg.sender == gameContract, "Not game contract");
        _;
    }

    function setAdmin(address admin, bool allowed) external onlyOwner {
        admins[admin] = allowed;
    }
    
    function setGameContract(address _gameContract) external onlyOwner {
        gameContract = _gameContract;
        emit GameContractUpdated(_gameContract);
    }

    // ============================================
    // MINTING
    // ============================================

    function mint(string calldata uri) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        xpByToken[tokenId] = 0;
        emit TokenMinted(msg.sender, tokenId, uri);
        return tokenId;
    }

    function batchMint(string[] calldata uris) external returns (uint256[] memory) {
        require(uris.length > 0 && uris.length <= 20, "Batch size 1-20");
        
        uint256[] memory tokenIds = new uint256[](uris.length);
        
        for (uint256 i = 0; i < uris.length; i++) {
            uint256 tokenId = nextTokenId++;
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, uris[i]);
            xpByToken[tokenId] = 0;
            tokenIds[i] = tokenId;
        }
        
        emit TokenBatchMinted(msg.sender, tokenIds, uris);
        return tokenIds;
    }

    // ============================================
    // XP SYSTEM
    // ============================================

    /// @notice Player claims XP directly (normal game end)
    /// @param tokenIds Array of token IDs
    /// @param xpAmounts Array of XP amounts (same length)
    function claimXp(uint256[] calldata tokenIds, uint256[] calldata xpAmounts) external {
        require(tokenIds.length > 0 && tokenIds.length <= 20, "1-20 cards");
        require(tokenIds.length == xpAmounts.length, "Arrays must match");
        
        uint256 totalXp = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_ownerOf(tokenIds[i]) == msg.sender, "Not your card");
            require(xpAmounts[i] <= 100, "Max 100 XP per card");
            
            xpByToken[tokenIds[i]] += xpAmounts[i];
            totalXp += xpAmounts[i];
        }
        
        emit XpClaimed(msg.sender, tokenIds, xpAmounts, totalXp);
    }
    
    /// @notice TokenGame contract assigns XP (for pending claims)
    /// @param player The player who owns the cards
    /// @param tokenIds Array of token IDs
    /// @param xpAmounts Array of XP amounts
    function assignXp(
        address player,
        uint256[] calldata tokenIds, 
        uint256[] calldata xpAmounts
    ) external onlyGame {
        require(tokenIds.length > 0 && tokenIds.length <= 20, "1-20 cards");
        require(tokenIds.length == xpAmounts.length, "Arrays must match");
        
        uint256 totalXp = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_ownerOf(tokenIds[i]) == player, "Player must own card");
            require(xpAmounts[i] <= 100, "Max 100 XP per card");
            
            xpByToken[tokenIds[i]] += xpAmounts[i];
            totalXp += xpAmounts[i];
        }
        
        emit XpAssigned(player, tokenIds, xpAmounts, totalXp);
    }

    /// @notice Get XP of a token
    function getXp(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return xpByToken[tokenId];
    }

    /// @notice Get level of a token (1 + XP/100)
    function levelOf(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return 1 + (xpByToken[tokenId] / 100);
    }

    // ============================================
    // ADMIN - Backend/moderation only
    // ============================================

    function adminBurn(uint256 tokenId) external onlyAdmin {
        _burn(tokenId);
        delete xpByToken[tokenId];
        emit TokenBurned(tokenId);
    }

    function adminSetXp(uint256 tokenId, uint256 xp) external onlyAdmin {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        xpByToken[tokenId] = xp;
    }

    function setTokenUri(uint256 tokenId, string calldata uri) external onlyAdmin {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, uri);
        emit TokenUriUpdated(tokenId, uri);
    }
}
