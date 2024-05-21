const hre = require("hardhat");
const contractGetters = require('../helpers/contracts-getters');

async function main() {
  await run("set-DRE");

  // Load the first signer
  const signer = await contractGetters.getFirstSigner();
  const signerAddress = await signer.getAddress();
  console.log(`Signer address: ${signerAddress}`);

  // Lending pool instance
  const lendingPool = await contractGetters.getLendingPool("0x428D9631C2602119C4068359Eb4dA37Cb346448f");

  // ERC20 token instance for collateral
  const COLLATERAL_TOK = await contractGetters.getIErc20Detailed("0x6ae1ac2f223e49bff649d5d5aa4a13270c2a0a71");
  console.log(`Collateral Token address: ${COLLATERAL_TOK.address}`);

  // ERC20 token instance for the asset to borrow
  const BORROW_TOK = await contractGetters.getIErc20Detailed("0x171397e9963ba8e0aece162450d9ef58b854c540");
  console.log(`Borrow Token address: ${BORROW_TOK.address}`);

  // Step 1: Approve the collateral token to be spent by the lending pool
  const approveTx = await COLLATERAL_TOK.connect(signer).approve(lendingPool.address, ethers.utils.parseUnits('100', 18));
  await approveTx.wait();
  console.log(`Approved 100 COLLATERAL_TOK for LendingPool`);

  // Step 2: Deposit the collateral token into the lending pool
  const depositTx = await lendingPool.connect(signer).deposit(COLLATERAL_TOK.address, ethers.utils.parseUnits('100', 18), signerAddress, 0);
  await depositTx.wait();
  console.log(`Deposited 100 COLLATERAL_TOK to LendingPool`);

  // Step 3: Enable the collateral token as collateral
  const enableCollateralTx = await lendingPool.connect(signer).setUserUseReserveAsCollateral(COLLATERAL_TOK.address, true);
  await enableCollateralTx.wait();
  console.log(`Enabled COLLATERAL_TOK as collateral in LendingPool`);

  // Step 4: Check available liquidity for the borrow token
  const reserveData = await lendingPool.getReserveData(BORROW_TOK.address);
  console.log(`Reserve Data:`, reserveData);

  const availableLiquidity = reserveData[1];
  console.log(`Available liquidity for ${await BORROW_TOK.symbol()}: ${availableLiquidity ? ethers.utils.formatUnits(availableLiquidity, 18) : 'undefined'}`);

  // Ensure availableLiquidity is defined and valid
  if (!availableLiquidity || availableLiquidity.isZero()) {
    console.error('Not enough liquidity to borrow the requested amount.');
    return;
  }

  // Step 5: Borrow the asset
  const amountToBorrow = ethers.utils.parseUnits('50', 18); // Amount to borrow
  const interestRateMode = 2; // Variable interest rate mode

  const borrowTx = await lendingPool.connect(signer).borrow(BORROW_TOK.address, amountToBorrow, interestRateMode, 0, signerAddress, { gasLimit: 500000 });
  await borrowTx.wait();
  console.log(`Borrowed 50 BORROW_TOK from LendingPool`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
