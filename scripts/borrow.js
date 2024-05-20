const hre = require("hardhat");
const contractGetters = require('../helpers/contracts-getters');

async function main() {
  await run("set-DRE");

  // Load the first signer
  const signer = await contractGetters.getFirstSigner();

  // Lending pool instance
  const lendingPool = await contractGetters.getLendingPool("0x428D9631C2602119C4068359Eb4dA37Cb346448f");

  // ERC20 token instance for the asset to borrow
  const BORROW_TOK = await contractGetters.getIErc20Detailed("0x6ae1ac2f223e49bff649d5d5aa4a13270c2a0a71");

  // Borrow 50 BORROW_TOK
  // interestRateMode: 1 for Stable, 2 for Variable
  const interestRateMode = 2; // Variable interest rate mode
  const amountToBorrow = ethers.utils.parseUnits('50', 18); // Amount to borrow

  // Borrow the asset
  const tx = await lendingPool.connect(signer).borrow(BORROW_TOK.address, amountToBorrow, interestRateMode, 0, await signer.getAddress(), { gasLimit: 500000 });
  console.log(await tx.wait());
  console.log(`Borrowed 50 BORROW_TOK from LendingPool`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
