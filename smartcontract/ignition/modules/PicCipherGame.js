const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// cUSD on Celo Mainnet: 0x765DE816845861e75A25fCA122bb6898B8B1282a
// If you want to deploy to Alfajores Testnet, change this to: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

module.exports = buildModule("PicCipherGameModule", (m) => {
  const cUSDAddress = m.getParameter("cUSDToken", CUSD_ADDRESS);

  const game = m.contract("PicCipherGame", [cUSDAddress]);

  return { game };
});
