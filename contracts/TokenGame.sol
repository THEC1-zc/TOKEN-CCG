// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Version: V0.1.0 - Game results storage + pending XP claims

interface ITokenCard {
    function ownerOf(uint256 tokenId) external view returns (address);
    function xpByToken(uint256 tokenId) external view returns (uint256);
}

contract TokenGame {
    
    address public owner;
    address public tokenCardContract;
    mapping(address => bool) public backends;
    
    // Game result storage
    struct GameResult {
        address player;
        uint256[] tokenIds;
        uint256[] xpAmounts;
        uint256 timestamp;
        bool claimed;
        bool isDisconnect;  // true = backend paid, false = normal game
    }
    
    mapping(bytes32 => GameResult) public games;
    mapping(address => bytes32[]) public playerGames;
    
    event GameRecorded(bytes32 indexed gameId, address indexed player, uint256 totalXp, bool isDisconnect);
    event XpClaimed(bytes32 indexed gameId, address indexed player, uint256[] tokenIds, uint256[] xpAmounts);
    
    constructor(address _tokenCardContract, address _backend) {
        owner = msg.sender;
        tokenCardContract = _tokenCardContract;
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
    
    function setBackend(address backend, bool allowed) external onlyOwner {
        backends[backend] = allowed;
    }
    
    function setTokenCardContract(address _contract) external onlyOwner {
        tokenCardContract = _contract;
    }
    
    // ============================================
    // BACKEND: Record game result (for disconnects)
    // ============================================
    
    /// @notice Backend records a game result (pays gas for disconnects)
    /// @param player The player address
    /// @param tokenIds Cards used in the game
    /// @param xpAmounts XP earned by each card
    /// @param isDisconnect True if player disconnected
    function recordGame(
        address player,
        uint256[] calldata tokenIds,
        uint256[] calldata xpAmounts,
        bool isDisconnect
    ) external onlyBackend returns (bytes32) {
        require(tokenIds.length > 0 && tokenIds.length <= 20, "1-20 cards");
        require(tokenIds.length == xpAmounts.length, "Arrays must match");
        
        // Verify player owns all cards
        ITokenCard cardContract = ITokenCard(tokenCardContract);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(cardContract.ownerOf(tokenIds[i]) == player, "Player doesn't own card");
            require(xpAmounts[i] <= 100, "Max 100 XP per card");
        }
        
        // Create unique game ID
        bytes32 gameId = keccak256(abi.encodePacked(player, block.timestamp, block.number));
        
        // Store game result
        games[gameId] = GameResult({
            player: player,
            tokenIds: tokenIds,
            xpAmounts: xpAmounts,
            timestamp: block.timestamp,
            claimed: false,
            isDisconnect: isDisconnect
        });
        
        playerGames[player].push(gameId);
        
        uint256 totalXp = 0;
        for (uint256 i = 0; i < xpAmounts.length; i++) {
            totalXp += xpAmounts[i];
        }
        
        emit GameRecorded(gameId, player, totalXp, isDisconnect);
        return gameId;
    }
    
    // ============================================
    // PLAYER: Claim pending XP
    // ============================================
    
    /// @notice Player claims XP from a recorded game
    /// @param gameId The game ID to claim
    function claimGameXp(bytes32 gameId) external {
        GameResult storage game = games[gameId];
        
        require(game.player == msg.sender, "Not your game");
        require(!game.claimed, "Already claimed");
        require(game.tokenIds.length > 0, "Game not found");
        
        // Verify player still owns all cards
        ITokenCard cardContract = ITokenCard(tokenCardContract);
        for (uint256 i = 0; i < game.tokenIds.length; i++) {
            require(cardContract.ownerOf(game.tokenIds[i]) == msg.sender, "You don't own this card anymore");
        }
        
        game.claimed = true;
        
        emit XpClaimed(gameId, msg.sender, game.tokenIds, game.xpAmounts);
        
        // Note: Actual XP is added via TokenCard.claimXp() called separately
        // This contract just tracks what's owed
    }
    
    // ============================================
    // VIEW FUNCTIONS
    // ============================================
    
    /// @notice Get all pending (unclaimed) games for a player
    function getPendingGames(address player) external view returns (bytes32[] memory) {
        bytes32[] memory allGames = playerGames[player];
        
        // Count pending
        uint256 pendingCount = 0;
        for (uint256 i = 0; i < allGames.length; i++) {
            if (!games[allGames[i]].claimed) {
                pendingCount++;
            }
        }
        
        // Build pending array
        bytes32[] memory pending = new bytes32[](pendingCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < allGames.length; i++) {
            if (!games[allGames[i]].claimed) {
                pending[idx++] = allGames[i];
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
    function getTotalPendingXp(address player) external view returns (uint256) {
        bytes32[] memory allGames = playerGames[player];
        uint256 total = 0;
        
        for (uint256 i = 0; i < allGames.length; i++) {
            if (!games[allGames[i]].claimed) {
                GameResult storage game = games[allGames[i]];
                for (uint256 j = 0; j < game.xpAmounts.length; j++) {
                    total += game.xpAmounts[j];
                }
            }
        }
        
        return total;
    }
}
