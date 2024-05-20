const hre = require("hardhat");
const contractGetters = require('../helpers/contracts-getters');

async function main() {
  await run("set-DRE")

  // Load the first signer
  const signer = await contractGetters.getFirstSigner();

  // Lending pool instance
  const lendingPool = await contractGetters.getLendingPool("0x428D9631C2602119C4068359Eb4dA37Cb346448f");

  // ERC20 token instance
  const COLLATERAL_TOK = await contractGetters.getIErc20Detailed("0x171397e9963ba8e0Aece162450D9eF58B854C540");

  // Enable ERC20 token as collateral
  const tx = await lendingPool.connect(signer).setUserUseReserveAsCollateral(COLLATERAL_TOK.address, true);
  console.log(await tx.wait());
  console.log(`Enabled COLLATERAL_TOK as collateral in LendingPool`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
