// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Version: V0.3.0 - Added batchMint for deck minting

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenCard is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public admins;
    mapping(uint256 => uint256) public xpByToken;

    event TokenMinted(address indexed to, uint256 indexed tokenId, string uri);
    event TokenBatchMinted(address indexed to, uint256[] tokenIds, string[] uris);
    event TokenBurned(uint256 indexed tokenId);
    event TokenXpUpdated(uint256 indexed tokenId, uint256 xp);
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

    // Public mint for testing (anyone can mint)
    function mint(string calldata uri) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        xpByToken[tokenId] = 0;
        emit TokenMinted(msg.sender, tokenId, uri);
        return tokenId;
    }

    // Batch mint for deck minting (10 cards in 1 transaction)
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

    // Admin-only burn (cleanup for testnet)
    function adminBurn(uint256 tokenId) external onlyAdmin {
        _burn(tokenId);
        delete xpByToken[tokenId];
        emit TokenBurned(tokenId);
    }

    // Admin-only XP update for test balancing
    function setXp(uint256 tokenId, uint256 xp) external onlyAdmin {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        xpByToken[tokenId] = xp;
        emit TokenXpUpdated(tokenId, xp);
    }

    // Admin-only metadata refresh hook (used while evolving card traits)
    function setTokenUri(uint256 tokenId, string calldata uri) external onlyAdmin {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, uri);
        emit TokenUriUpdated(tokenId, uri);
    }

    function levelOf(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return 1 + (xpByToken[tokenId] / 100);
    }

}
