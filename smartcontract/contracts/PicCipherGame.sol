// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PicCipherGame is ERC721, Ownable {
    struct PlayerProfile {
        string nickname;
        uint256 currentStage;
        bool isRegistered;
    }

    IERC20 public cUSDToken;
    uint256 public bypassFee = 0.05 ether; // 0.05 cUSD
    uint256 public hintFee = 0.01 ether; // 0.01 cUSD

    uint256 public nextTokenId = 1;

    mapping(address => PlayerProfile) public profiles;
    mapping(uint256 => bytes32) public stageAnswerHashes;
    
    event PlayerRegistered(address indexed player, string nickname, uint256 tokenId);
    event StageCompleted(address indexed player, uint256 stageId);
    event StageBypassed(address indexed player, uint256 stageId);
    event HintPurchased(address indexed player, uint256 stageId);
    event BadgeMinted(address indexed player, uint256 stageId, uint256 tokenId);

    constructor(address _cUSDToken) ERC721("PicCipher Badges", "PCB") Ownable(msg.sender) {
        cUSDToken = IERC20(_cUSDToken);
    }

    function setCUSDToken(address _cUSDToken) external onlyOwner {
        cUSDToken = IERC20(_cUSDToken);
    }

    function setFees(uint256 _bypassFee, uint256 _hintFee) external onlyOwner {
        bypassFee = _bypassFee;
        hintFee = _hintFee;
    }

    function setStageAnswerHash(uint256 _stageId, bytes32 _answerHash) external onlyOwner {
        stageAnswerHashes[_stageId] = _answerHash;
    }

    function registerUser(string calldata _nickname) external {
        require(!profiles[msg.sender].isRegistered, "Already registered");
        require(bytes(_nickname).length > 0, "Nickname required");

        profiles[msg.sender] = PlayerProfile({
            nickname: _nickname,
            currentStage: 1,
            isRegistered: true
        });

        // Mint Beginner Badge
        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);

        emit PlayerRegistered(msg.sender, _nickname, tokenId);
        emit BadgeMinted(msg.sender, 0, tokenId); // Stage 0 = Beginner
    }

    function submitStageAnswer(string calldata _answer) external {
        require(profiles[msg.sender].isRegistered, "Not registered");
        uint256 currentStage = profiles[msg.sender].currentStage;
        bytes32 correctHash = stageAnswerHashes[currentStage];
        require(correctHash != bytes32(0), "Stage not available yet");
        
        bytes32 answerHash = sha256(abi.encodePacked(_answer));
        require(answerHash == correctHash, "Incorrect answer");

        _advanceStage(msg.sender);
    }

    function bypassStage() external {
        require(profiles[msg.sender].isRegistered, "Not registered");
        uint256 currentStage = profiles[msg.sender].currentStage;
        require(stageAnswerHashes[currentStage] != bytes32(0), "Stage not available yet");

        require(cUSDToken.transferFrom(msg.sender, owner(), bypassFee), "Fee transfer failed");
        
        emit StageBypassed(msg.sender, currentStage);
        _advanceStage(msg.sender);
    }

    function buyHint() external {
        require(profiles[msg.sender].isRegistered, "Not registered");
        uint256 currentStage = profiles[msg.sender].currentStage;
        require(stageAnswerHashes[currentStage] != bytes32(0), "Stage not available yet");

        require(cUSDToken.transferFrom(msg.sender, owner(), hintFee), "Fee transfer failed");
        
        emit HintPurchased(msg.sender, currentStage);
    }

    function _advanceStage(address player) internal {
        uint256 completedStage = profiles[player].currentStage;
        profiles[player].currentStage += 1;
        
        emit StageCompleted(player, completedStage);

        // Mint milestone badges
        if (completedStage == 10 || completedStage == 25 || completedStage == 50) {
            uint256 tokenId = nextTokenId++;
            _mint(player, tokenId);
            emit BadgeMinted(player, completedStage, tokenId);
        }
    }
}
