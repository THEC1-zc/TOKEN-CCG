// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Version: V0.4.0 - Player adds XP to own cards after games

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenCard is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public admins;
    mapping(uint256 => uint256) public xpByToken;

    event TokenMinted(address indexed to, uint256 indexed tokenId, string uri);
    event TokenBatchMinted(address indexed to, uint256[] tokenIds, string[] uris);
    event TokenBurned(uint256 indexed tokenId);
    event XpAdded(address indexed player, uint256[] tokenIds, uint256 xpEach, uint256 totalXpAwarded);
    event TokenUriUpdated(uint256 indexed tokenId, string uri);

    constructor(address admin1, address admin2) ERC721("TOKEN Card", "TCARD") Ownable(msg.sender) {
        admins[admin1] = true;
        admins[admin2] = true;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || owner() == msg.sender, "Not admin");
        _;
    }

    function setAdmin(address admin, bool allowed) external onlyOwner {
        admins[admin] = allowed;
    }

    // ============================================
    // MINTING - Anyone can mint their own cards
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
    // XP SYSTEM - Owner adds XP to own cards
    // ============================================

    /// @notice Add XP to your cards after a game (batch)
    /// @param tokenIds Cards that were used in the game
    /// @param xpEach XP to add to each card (max 50 per call to prevent abuse)
    function claimGameXp(uint256[] calldata tokenIds, uint256 xpEach) external {
        require(tokenIds.length > 0 && tokenIds.length <= 20, "1-20 cards");
        require(xpEach > 0 && xpEach <= 50, "XP 1-50 per game");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_ownerOf(tokenIds[i]) == msg.sender, "Not your card");
            xpByToken[tokenIds[i]] += xpEach;
        }
        
        emit XpAdded(msg.sender, tokenIds, xpEach, tokenIds.length * xpEach);
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
    // ADMIN - Only for backend/moderation
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
