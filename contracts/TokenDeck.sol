// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Version: V0.1.0

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenDeck is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public admins;

    event DeckMinted(address indexed to, uint256 indexed tokenId, string uri);
    event DeckBurned(uint256 indexed tokenId);
    event DeckUriUpdated(uint256 indexed tokenId, string uri);

    constructor(address admin1, address admin2) ERC721("TOKEN Deck", "TDECK") Ownable(msg.sender) {
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

    // Public mint for testnet game loops
    function mint(string calldata uri) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        emit DeckMinted(msg.sender, tokenId, uri);
        return tokenId;
    }

    // Admin-only burn during test resets
    function adminBurn(uint256 tokenId) external onlyAdmin {
        _burn(tokenId);
        emit DeckBurned(tokenId);
    }

    function setTokenUri(uint256 tokenId, string calldata uri) external onlyAdmin {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, uri);
        emit DeckUriUpdated(tokenId, uri);
    }
}
