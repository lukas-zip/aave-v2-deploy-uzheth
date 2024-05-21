const hre = require("hardhat");
const contractGetters = require('../helpers/contracts-getters');

async function main() {
  await run("set-DRE")

  // Load the first signer
  const signer = await contractGetters.getFirstSigner();

  // Lending pool instance
  // Replace with your actual lending pool address
  const lendingPool = await contractGetters.getLendingPool("0x428D9631C2602119C4068359Eb4dA37Cb346448f");

  // ERC20 token instance
  // Replace with your actual ERC20 token address
  const TOK = await contractGetters.getIErc20Detailed("0x171397e9963ba8e0aece162450d9ef58b854c540");

  // Approve a specific amount of TOK for the Lending Pool
  // You can modify the amount as needed
  await TOK.connect(signer).approve(lendingPool.address, ethers.utils.parseUnits('100', 18));
  console.log(`Approved TOK for LendingPool`);

  // Withdraw ERC20 tokens from the Lending Pool
  // The amount must match the approved amount above
  const tx = await lendingPool.connect(signer).deposit(TOK.address, ethers.utils.parseUnits('100', 18), await signer.getAddress(), '0', { gasLimit: 500000 });
  console.log(await tx.wait());
  console.log(`Deposited TOK to LendingPool`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
