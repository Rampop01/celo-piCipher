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
    
    address[] public allPlayers;
    mapping(address => bool) public isPlayerRegistered;

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

    function createRound(uint8 _mode, bytes32 _answerHash) external onlyOwner {
        require(_mode >= 1 && _mode <= 4, "Invalid mode");
        
        currentRoundId++;
        rounds[currentRoundId] = GameRound({
            roundId: currentRoundId,
            mode: _mode,
            answerHash: _answerHash,
            isActive: true
        });

        emit RoundCreated(currentRoundId, _mode);
    }

    function deactivateRound(uint256 _roundId) external onlyOwner {
        require(rounds[_roundId].isActive, "Round is already inactive");
        rounds[_roundId].isActive = false;
    }

    function submitAnswer(uint256 _roundId, string calldata _answer) external {
        require(rounds[_roundId].isActive, "Round is not active");
        require(!hasPlayedRound[msg.sender][_roundId], "Already played this round");

        hasPlayedRound[msg.sender][_roundId] = true;
        
        if (!isPlayerRegistered[msg.sender]) {
            isPlayerRegistered[msg.sender] = true;
            allPlayers.push(msg.sender);
        }
        
        PlayerStats storage stats = players[msg.sender];
        stats.gamesPlayed++;
        stats.lastPlayedTimestamp = block.timestamp;

        // Hash the submitted answer (converted to lowercase before hashing in frontend)
        bytes32 submittedHash = keccak256(abi.encodePacked(_answer));
        
        bool isCorrect = (submittedHash == rounds[_roundId].answerHash);
        uint256 pointsEarned = 0;

        if (isCorrect) {
            // Points = 10 * mode (e.g. 1-pic = 10pts, 4-pic = 40pts)
            pointsEarned = 10 * rounds[_roundId].mode;
            
            // Streak logic
            stats.currentStreak++;
            if (stats.currentStreak > stats.bestStreak) {
                stats.bestStreak = stats.currentStreak;
            }
            
            // Bonus points for streaks
            if (stats.currentStreak >= 5) {
                pointsEarned += 5; // Flat +5 bonus for being on a hot streak
                if (stats.currentStreak % 5 == 0) {
                    emit StreakAchieved(msg.sender, stats.currentStreak);
                }
            }
            
            stats.totalScore += pointsEarned;
        } else {
            // Reset streak on wrong answer
            stats.currentStreak = 0;
        }

        emit AnswerSubmitted(msg.sender, _roundId, isCorrect, pointsEarned);
    }

    function getPlayerStats(address _player) external view returns (PlayerStats memory) {
        return players[_player];
    }

    function getAllPlayers() external view returns (address[] memory) {
        return allPlayers;
    }
}
