[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Build pass](https://github.com/AAVE/protocol-v2/actions/workflows/node.js.yml/badge.svg)](https://github.com/aave/protocol-v2/actions/workflows/node.js.yml)
```
        .///.                .///.     //.            .//  `/////////////-
       `++:++`              .++:++`    :++`          `++:  `++:......---.`
      `/+: -+/`            `++- :+/`    /+/         `/+/   `++.
      /+/   :+/            /+:   /+/    `/+/        /+/`   `++.
  -::/++::`  /+:       -::/++::` `/+:    `++:      :++`    `++/:::::::::.
  -:+++::-`  `/+:      --++/---`  `++-    .++-    -++.     `++/:::::::::.
   -++.       .++-      -++`       .++.    .++.  .++-      `++.
  .++-         -++.    .++.         -++.    -++``++-       `++.
 `++:           :++`  .++-           :++`    :+//+:        `++:----------`
 -/:             :/-  -/:             :/.     ://:         `/////////////-
```

# Aave Protocol v2

This repository contains the smart contracts source code and markets configuration for the deployment of Aave Protocol V2 to the custom blockchain UZHETH.  The repository uses Docker Compose and Hardhat as development enviroment for compilation, testing and deployment tasks.
The repository is forked and adapted based on the open-source Aave Protocol v2: https://github.com/aave/protocol-v2.git

## What is Aave?

Aave is a decentralized non-custodial liquidity markets protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.

## Documentation

The official documentation of Aave V2 is in the following [Aave V2 documentation](https://docs.aave.com/developers/v/2.0/) link. At the documentation you can learn more about the protocol, see the contract interfaces, integration guides and audits.

A more detailed and technical description of the protocol can be found in this repository, [here](./aave-v2-whitepaper.pdf)


## How to deploy Aave V2 in UZHETH network

The repository uses Docker Compose to manage sensitive keys and load the configuration. Prior any action like test or deploy, you must run `docker-compose up` to start the `contracts-env` container, and then connect to the container console via `docker-compose exec contracts-env bash`.

Follow the next steps to setup the repository:
1. Install docker and docker-compose
2. In order to use hardhat, make sure npm is installed on your device
```bash
npm install
```
3. Create an enviroment file named `.env` and fill the enviroment variables MNEMONIC and EMERGENCY_ACCOUNT.
```
# (Required) Mnemonic, only first address will be used
MNEMONIC=""
EMERGENCY_ACCOUNT=""

# (Optional) Add Alchemy or Infura provider keys, alchemy takes preference at the config level
ALCHEMY_KEY=""
INFURA_KEY=""


# (Optional) Etherscan key, for automatize the verification of the contracts at Etherscan
ETHERSCAN_KEY=""

# (Optional) if you plan to use Tenderly scripts
TENDERLY_PROJECT=""
TENDERLY_USERNAME=""
```
4. Run docker-compose:
```bash
docker-compose up
```

5. In a second terminal connect to the container console via:
```bash
docker-compose exec contracts-env bash.
```

## Markets configuration

The configurations related with the Aave Markets are located at `markets` directory. You can follow the `IAaveConfiguration` interface to create new Markets configuration or extend the current Aave configuration.

Each market should have his own Market configuration file, and their own set of deployment tasks, using the Aave market config and tasks as a reference.

For the UZHETH network see the configuration folder /markets/uzheth.

## Test

You can run the full test suite with the following commands:

```
# In one terminal
docker-compose up

# Open another tab or terminal
docker-compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run test
```

## Deployments

For deploying Aave Protocol V2, you can use the available scripts located at `package.json`. For a complete list, run `npm run` to see all the tasks.


### UZHETH deployment
```
# In one terminal
docker-compose up

# Open another tab or terminal
docker-compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run uzheth:full:migration
```

A comprehensive list of all deployed contracts is available in the `deployed-contracts.json` file, located in the root directory.

## Create ERC20 Tokens
The example code below demonstrates how to create an ERC20 token using Remix. First, compile and deploy the contract. Once deployed, you can add the tokens to your MetaMask wallet by using the contract ID.
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts@4.9.3/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@4.9.3/access/Ownable.sol";
contract UZHETH is ERC20, Ownable {
    constructor() ERC20("UZHETH", "UZHETH") {
        _mint(msg.sender, 60000 * 10 ** decimals());
    }
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
} }
```

## Interact with Aave in UZHETH via console

You can interact with Aave using the Hardhat console.

Run the Hardhat console pointing to the UZHETH network:

```bash
docker-compose run contracts-env npx hardhat --network uzheth console
```

At the Hardhat console, you can interact with the protocol:

### Deposit ERC20 tokens on AAVE (get ATokens back)
```
// Load the HRE into helpers to access signers
run("set-DRE")

// Import getters to instance any Aave contract
const contractGetters = require('./helpers/contracts-getters');

// Load the first signer
const signer = await contractGetters.getFirstSigner();

// Lending pool instance
const lendingPool = await contractGetters.getLendingPool("0xxxx");

// ERC20 token instance
const TOK = await contractGetters.getIErc20Detailed("0xxxx");

// Approve 100 ERC20 token to LendingPool address
await TOK.connect(signer).approve(lendingPool.address, ethers.utils.parseUnits('100', 18));

// Deposit 100 ERC20 token
const tx = await lendingPool.connect(signer).deposit(TOK.address, ethers.utils.parseUnits('100', 18), await signer.getAddress(), '0');
await tx.wait();
```

### Withdraw ERC20 tokens from AAVE (burn ATokens)
```
// Load the HRE into helpers to access signers
run("set-DRE")

// Import getters to instance any Aave contract
const contractGetters = require('./helpers/contracts-getters');

// Load the first signer
const signer = await contractGetters.getFirstSigner();

// Lending pool instance
const lendingPool = await contractGetters.getLendingPool("0xxxx");

// ERC20 token instance
const TOK = await contractGetters.getIErc20Detailed("0xxxx");

// Set amount to withdraw from LendingPool
await TOK.connect(signer).approve(lendingPool.address, ethers.utils.parseUnits('100', 18));

// Withdraw 100 ERC20 token
const tx2 = await lendingPool.connect(signer).withdraw(TOK.address, amountToWithdraw, signer.getAddress());
await tx2.wait();
```

## Interact with Aave in UZHETH via scripts
Instead of using the Hardhat console, you can use our custom scripts for various use cases. Each script is designed to streamline interactions with the lending pool, making it easier and more efficient to manage assets.
The scripts are located in the `/scripts` folder and can be executed by running the command:

#### Replace 'xxx' with the desired script name (e.g., deposit, withdraw etc.)
```bash
docker-compose run contracts-env npx hardhat run scripts/xxx.js --network uzheth
```

- `deposit.js`: This script allows you to deposit ERC-20 tokens into the lending pool and receive aTokens in return.
- `withdraw.js`: This script enables you to withdraw ERC-20 tokens from the lending pool, burning the corresponding aTokens in the process.
- `enable_tok_as_collateral.js`: This sets the deposited tokens as collateral for borrowing against them.
- `borrow.js`: This script assumes you have already approved, deposited (`deposit.js`), and enabled your tokens as collateral (`enable_tok_as_collateral.js`) using the previous scripts.
- `deposit_and_borrow.js`: This script deposits collateral into a lending pool, enables it as collateral, checks available liquidity, and then borrows tokens if sufficient liquidity is available.

In addition to our implementation scripts, any method and function defined in `contracts/interfaces/ILendingPool.sol` can be used to interact with the lending pool and create use cases. These functions provide comprehensive functionality for managing assets within the pool (e.g. flash loans etc.)


