const hre = require("hardhat");
const contractGetters = require('../helpers/contracts-getters');

async function main() {
  await run("set-DRE");

  // Load the first signer
  const signer = await contractGetters.getFirstSigner();
  const signerAddress = await signer.getAddress();
  console.log(`Signer address: ${signerAddress}`);

  // Lending pool instance
  // Replace with your actual lending pool address
  const lendingPool = await contractGetters.getLendingPool("0x428D9631C2602119C4068359Eb4dA37Cb346448f");

  // ERC20 token instance for the asset to repay
  // Replace with your actual token address
  const BORROW_TOK = await contractGetters.getIErc20Detailed("0x171397e9963ba8e0aece162450d9ef58b854c540");
  console.log(`Borrow Token address: ${BORROW_TOK.address}`);

  // Amount to repay
  // You can modify the amount as needed
  const amountToRepay = ethers.utils.parseUnits('50', 18);
  const interestRateMode = 2; // Variable interest rate mode

  // Step 1: Approve the borrowed token to be spent by the lending pool
  const approveTx = await BORROW_TOK.connect(signer).approve(lendingPool.address, amountToRepay);
  await approveTx.wait();
  console.log(`Approved ${amountToRepay.toString()} BORROW_TOK for LendingPool`);

  // Step 2: Repay the borrowed amount
  const repayTx = await lendingPool.connect(signer).repay(BORROW_TOK.address, amountToRepay, interestRateMode, signerAddress, { gasLimit: 500000 });
  await repayTx.wait();
  console.log(`Repaid ${amountToRepay.toString()} BORROW_TOK to LendingPool`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
