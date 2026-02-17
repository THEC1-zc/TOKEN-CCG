// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Version: V0.1.0 - Game results storage + pending XP claims

interface ITokenCard {
    function ownerOf(uint256 tokenId) external view returns (address);
    function assignXp(address player, uint256[] calldata tokenIds, uint256[] calldata xpAmounts) external;
}

contract TokenGame {
    
    ITokenCard public tokenCard;
    address public owner;
    mapping(address => bool) public backends;
    
    // Game result storage
    struct GameResult {
        address player;
        uint256[] tokenIds;
        uint256[] xpAmounts;
        uint256 timestamp;
        bool claimed;
        bool isDisconnect;
    }
    
    mapping(bytes32 => GameResult) public games;
    mapping(address => bytes32[]) public playerGames;
    
    uint256 public gameNonce;
    
    // Events
    event GameRecorded(bytes32 indexed gameId, address indexed player, uint256 totalXp, bool isDisconnect);
    event XpClaimed(bytes32 indexed gameId, address indexed player, uint256 totalXp);
    event BackendUpdated(address indexed backend, bool allowed);
    
    constructor(address _tokenCard, address _backend) {
        tokenCard = ITokenCard(_tokenCard);
        owner = msg.sender;
        backends[_backend] = true;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyBackend() {
        require(backends[msg.sender] || msg.sender == owner, "Not backend");
        _;
    }
    
    // ============================================
    // BACKEND FUNCTIONS - Record disconnected games
    // ============================================
    
    /// @notice Backend records a game result (for disconnects)
    function recordGame(
        address player,
        uint256[] calldata tokenIds,
        uint256[] calldata xpAmounts
    ) external onlyBackend returns (bytes32) {
        require(tokenIds.length == xpAmounts.length, "Arrays must match");
        require(tokenIds.length > 0 && tokenIds.length <= 20, "1-20 cards");
        
        gameNonce++;
        bytes32 gameId = keccak256(abi.encodePacked(player, gameNonce, block.timestamp));
        
        // Verify player owns all cards and XP is valid
        uint256 totalXp = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(tokenCard.ownerOf(tokenIds[i]) == player, "Player must own card");
            require(xpAmounts[i] <= 100, "Max 100 XP per card");
            totalXp += xpAmounts[i];
        }
        
        games[gameId] = GameResult({
            player: player,
            tokenIds: tokenIds,
            xpAmounts: xpAmounts,
            timestamp: block.timestamp,
            claimed: false,
            isDisconnect: true
        });
        
        playerGames[player].push(gameId);
        
        emit GameRecorded(gameId, player, totalXp, true);
        return gameId;
    }
    
    // ============================================
    // PLAYER FUNCTIONS
    // ============================================
    
    /// @notice Player claims pending XP - calls TokenCard.assignXp
    function claimGameXp(bytes32 gameId) external {
        GameResult storage game = games[gameId];
        require(game.player == msg.sender, "Not your game");
        require(!game.claimed, "Already claimed");
        
        game.claimed = true;
        
        // Calculate total XP for event
        uint256 totalXp = 0;
        for (uint256 i = 0; i < game.xpAmounts.length; i++) {
            totalXp += game.xpAmounts[i];
        }
        
        // Call TokenCard to assign XP
        tokenCard.assignXp(msg.sender, game.tokenIds, game.xpAmounts);
        
        emit XpClaimed(gameId, msg.sender, totalXp);
    }
    
    /// @notice Claim all pending games at once
    function claimAllPendingXp() external {
        bytes32[] memory allGames = playerGames[msg.sender];
        
        for (uint256 i = 0; i < allGames.length; i++) {
            GameResult storage game = games[allGames[i]];
            if (!game.claimed && game.player == msg.sender) {
                game.claimed = true;
                
                uint256 totalXp = 0;
                for (uint256 j = 0; j < game.xpAmounts.length; j++) {
                    totalXp += game.xpAmounts[j];
                }
                
                tokenCard.assignXp(msg.sender, game.tokenIds, game.xpAmounts);
                
                emit XpClaimed(allGames[i], msg.sender, totalXp);
            }
        }
    }
    
    /// @notice Get all pending (unclaimed) games for a player
    function getPendingGames(address player) external view returns (bytes32[] memory) {
        bytes32[] memory allGames = playerGames[player];
        
        uint256 pendingCount = 0;
        for (uint256 i = 0; i < allGames.length; i++) {
            if (!games[allGames[i]].claimed) {
                pendingCount++;
            }
        }
        
        bytes32[] memory pending = new bytes32[](pendingCount);
        uint256 j = 0;
        for (uint256 i = 0; i < allGames.length; i++) {
            if (!games[allGames[i]].claimed) {
                pending[j] = allGames[i];
                j++;
            }
        }
        
        return pending;
    }
    
    /// @notice Get game details
    function getGame(bytes32 gameId) external view returns (
        address player,
        uint256[] memory tokenIds,
        uint256[] memory xpAmounts,
        uint256 timestamp,
        bool claimed,
        bool isDisconnect
    ) {
        GameResult storage game = games[gameId];
        return (
            game.player,
            game.tokenIds,
            game.xpAmounts,
            game.timestamp,
            game.claimed,
            game.isDisconnect
        );
    }
    
    /// @notice Get total pending XP for a player
    function getTotalPendingXp(address player) external view returns (uint256 totalXp, uint256 gameCount) {
        bytes32[] memory allGames = playerGames[player];
        
        for (uint256 i = 0; i < allGames.length; i++) {
            GameResult storage game = games[allGames[i]];
            if (!game.claimed) {
                gameCount++;
                for (uint256 j = 0; j < game.xpAmounts.length; j++) {
                    totalXp += game.xpAmounts[j];
                }
            }
        }
    }
    
    // ============================================
    // ADMIN
    // ============================================
    
    function setBackend(address backend, bool allowed) external onlyOwner {
        backends[backend] = allowed;
        emit BackendUpdated(backend, allowed);
    }
    
    function setTokenCard(address _tokenCard) external onlyOwner {
        tokenCard = ITokenCard(_tokenCard);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
