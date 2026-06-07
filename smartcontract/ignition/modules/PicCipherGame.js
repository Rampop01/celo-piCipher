const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PicCipherGameModule", (m) => {
  const game = m.contract("PicCipherGame");

  return { game };
});
