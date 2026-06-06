// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PicCipherGame {
    struct PlayerStats {
        uint256 totalScore;
        uint256 currentStreak;
        uint256 bestStreak;
        uint256 gamesPlayed;
        uint256 lastPlayedTimestamp;
    }

    struct GameRound {
        uint256 roundId;
        uint8 mode; // 1, 2, 3, or 4 pics
        bytes32 answerHash; // Keccak256 hash of the correct answer
        bool isActive;
    }

    address public owner;
    uint256 public currentRoundId;
    
    mapping(uint256 => GameRound) public rounds;
    mapping(address => PlayerStats) public players;
    mapping(address => mapping(uint256 => bool)) public hasPlayedRound;

    event RoundCreated(uint256 indexed roundId, uint8 mode);
    event AnswerSubmitted(address indexed player, uint256 indexed roundId, bool isCorrect, uint256 pointsEarned);
    event StreakAchieved(address indexed player, uint256 streakLength);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }
}
