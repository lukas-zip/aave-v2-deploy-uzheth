const hre = require("hardhat");
const contractGetters = require('../helpers/contracts-getters');

async function main() {
  await run("set-DRE");

  // Load the first signer
  const signer = await contractGetters.getFirstSigner();

  // Lending pool instance
  // Replace with your actual lending pool address
  const lendingPool = await contractGetters.getLendingPool("0x428D9631C2602119C4068359Eb4dA37Cb346448f");

  // ERC20 token instance for the asset to borrow
  // Replace with your actual token address
  const BORROW_TOK = await contractGetters.getIErc20Detailed("0x171397e9963ba8e0Aece162450D9eF58B854C540");

  // Borrow BORROW_TOK
  // interestRateMode: 1 for Stable, 2 for Variable
  // You can modify the amountToBorrow as needed
  const interestRateMode = 2; // Variable interest rate mode
  const amountToBorrow = ethers.utils.parseUnits('5', 18); // Amount to borrow

  // Borrow the asset
  const tx = await lendingPool.connect(signer).borrow(BORROW_TOK.address, amountToBorrow, interestRateMode, 0, await signer.getAddress(), { gasLimit: 500000 });
  console.log(await tx.wait());
  console.log(`Borrowed BORROW_TOK from LendingPool`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
