const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const contractAddress = "0x511eb648f6946bFEED42014c6D95AeCa97cB03eA";
  console.log("Attaching to PicCipherGame at", contractAddress);
  
  const Game = await hre.ethers.getContractFactory("PicCipherGame");
  const game = Game.attach(contractAddress);

  const answersStr = fs.readFileSync("answers.json", "utf-8");
  const answers = JSON.parse(answersStr);

  console.log(`Setting up ${answers.length} stage hashes...`);

  // We should send them in batches so we don't hit gas limits, or just loop and send individually if gas is fine.
  // Actually, sending 50 transactions sequentially might take a while. Let's do it in a loop and wait for each.
  // Or we can modify the contract to have a setBatchHashes function? The contract only has setStageAnswerHash.
  
  for (let i = 0; i < answers.length; i++) {
    const stageId = i + 1;
    const word = answers[i];
    
    // Hash the word exactly as the contract would: sha256(abi.encodePacked(_answer))
    // ethers.js hash:
    const hash = hre.ethers.solidityPackedSha256(["string"], [word]);
    
    console.log(`Setting hash for stage ${stageId} (${word}) -> ${hash}`);
    
    // Check if already set to avoid wasting gas
    const currentHash = await game.stageAnswerHashes(stageId);
    if (currentHash !== hash) {
      const tx = await game.setStageAnswerHash(stageId, hash);
      await tx.wait();
      console.log(`Stage ${stageId} hash set!`);
    } else {
      console.log(`Stage ${stageId} already set.`);
    }
  }

  console.log("All hashes configured successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
