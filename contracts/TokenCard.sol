// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Version: V0.1.0

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenCard is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public admins;

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
        return tokenId;
    }

    // Admin-only burn (cleanup for testnet)
    function adminBurn(uint256 tokenId) external onlyAdmin {
        _burn(tokenId);
    }
}
