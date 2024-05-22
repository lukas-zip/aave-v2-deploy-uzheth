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


# How to deploy Aave V2 in UZHETH network
This README provides a detailed explanation of the `uzheth:mainnet` deployment script for the UZHETH project. This repository is designed to deploy a development environment for the UZHETH protocol using Hardhat.

## Deployment Setup

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
docker-compose exec contracts-env bash
```

## Deployment to UZHETH

For deploying Aave Protocol V2, you can use the available scripts located at `package.json`. For a complete list, run `npm run` to see all the tasks.

```
# In one terminal
docker-compose up

# Open another tab or terminal
docker-compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run uzheth:full:migration
```

A comprehensive list of all deployed contracts is available in the `deployed-contracts.json` file, located in the root directory.

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

# Explanations Code
In this section, we provide detailed explanations of the code modifications made to integrate UZHETH into the market configurations for the Aave protocol.

## Helpers configuration

We adapted several files within the helpers folder to integrate UZHETH into the market configurations.
- `configuration.ts`: Integrates UZHETH into the configuration loading and parameter fetching mechanisms for Aave pools.
- `constants.ts`: Defines specific constants and mock price feeds for UZHETH.
- `contract-helpers.ts`: Adapts contract deployment and parameter utilities to support the UZHETH network.
- `types.ts`: Defines the UZHETH network and pool types, extending the type definitions to support UZHETH-specific configurations and assets.

## Markets configuration

The configurations related with the Aave markets are located at `markets` directory.
Each market should have his own market configuration file, and their own set of deployment tasks.

To create a new market configuration for UZHETH, we created a new folder within the `markets` directory. This new configuration is adapted from the existing Aave market configurations to suit the UZHETH chain. Adjustments include setting specific configurations, lending rates, and reserve assets.
The setup includes two main files: common.ts and index.ts.

`common.ts`
- Protocol Global Parameters: Defines global parameters for the UZHETH protocol (e.g. market identifiers, token prefixes and oracles)
- Mock Prices: Sets prices for mock assets.
- Lending Rate Oracle Rates: Specifies borrowing rates for assets in the UZHETH market.
- Protocol Addresses: Configures protocol-specific addresses for different network environments, including emergency admin, provider registry, and oracles.
- Reserve Assets: Here we specify the ERC20 tokens that are allowed as reserve assets for the lending pool.

`index.ts`
- Market Configuration: Sets the configuration for the UZHETH market.
- Provider ID and Market ID: Here we set the identifiers for the UZHETH market.
- Reserves Config: Includes strategies for assets, specifying their configurations for the UZHETH market.
- Reserve Assets: Maps the allowed ERC20 tokens to their corresponding contract addresses.

For the UZHETH network configuration, refer to the folder at `markets/uzheth`.

## Deployment Scripts

### 1. UZHETH Mainnet Deployment Script
The script in `tasks/migrations/uzheth.mainnet.ts` automates the deployment of the UZHETH protocol on the mainnet, handling everything from contract deployment to initialization. The script will be run by using the command `npx hardhat uzheth:mainnet --network mainnet`.
Specifically it sets up:
- Setup Development Environment (Initialize hardhat runtime)
- Deploy Contracts (Lending Pool, Oracles, Address Provider Registry etc.)
- Initialize Lending Pool
- Deploy UI Helpers
- etc.

### 2. Hardhat Config
The `hardhat.config.ts` configuration file in the root directory sets up the Hardhat environment for the UZHETH protocol.
The configuration is defined with the following settings:
```
uzheth: getCommonNetworkConfig(eEthereumNetwork.uzheth, 702)
```
- Network Name: uzheth
- Network ID: 702

Settings: It uses the common network configuration function getCommonNetworkConfig, which is configured with specific RPC URL, gas settings, and account mnemonics.

### 3. Helper Hardhat Config
The `helper-hardhat-config.ts` file is designed to configure the UZHETH blockchain network settings for use with Hardhat. In respect to the UZHETH network, the file does the following:
- Loads environment variables for UZHETH such as INFURA_KEY and ALCHEMY_KEY
- Gas settings
- Specifies the RPC URL for the UZHETH network
```
[eEthereumNetwork.uzheth]: 'https://rpc.uzhethw.ifi.uzh.ch',
```

### 4. Network Scripts and Configuration
The `package.json` configuration file primarily sets up the environment for deploying and managing the Aave Protocol V2 smart contracts. Specific adaptations for the UZHETH network include:
- Network Scripts: Added scripts to support deploying and interacting with the UZHETH network
- Network Configuration: Configuration for the UZHETH network is defined in the Hardhat config file to enable specific settings and parameters required for deployment and interaction.

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

# Interact with Aave in UZHETH via console

You can interact with Aave using the Hardhat console.

Run the Hardhat console pointing to the UZHETH network:

```bash
docker-compose run contracts-env npx hardhat --network uzheth console
```

At the Hardhat console, you can interact with the protocol using the following two example use cases:

## Deposit ERC20 tokens on AAVE (get ATokens back)
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

## Withdraw ERC20 tokens from AAVE (burn ATokens)
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

# Interact with Aave in UZHETH via scripts
Instead of using the Hardhat console, you can use our custom scripts for various use cases. Each script is designed to streamline interactions with the lending pool, making it easier and more efficient to manage assets.
The scripts are located in the `./scripts` folder and can be executed by running the command:

### Replace 'xxx' with the desired script name (e.g., deposit, withdraw etc.)
```bash
docker-compose run contracts-env npx hardhat run scripts/xxx.js --network uzheth
```

- `deposit.js`: This script allows you to deposit ERC20 tokens into the lending pool and receive aTokens in return.
- `withdraw.js`: This script enables you to withdraw ERC20 tokens from the lending pool, burning the corresponding aTokens in the process.
- `enable_tok_as_collateral.js`: This sets the deposited tokens as collateral for borrowing against them.
- `borrow.js`: This script assumes you have already approved, deposited (`deposit.js`), and enabled your tokens as collateral (`enable_tok_as_collateral.js`) using the previous scripts.
- `deposit_and_borrow.js`: This script deposits collateral into a lending pool, enables it as collateral, checks available liquidity, and then borrows tokens if sufficient liquidity is available.
- `repay.js`: This script allows to repay a borrowed ERC20 token to the lending pool.

In addition to our implementation scripts, any method and function defined in `./contracts/interfaces/ILendingPool.sol` can be used to interact with the lending pool and create use cases. These functions provide comprehensive functionality for managing assets within the pool (e.g. flash loans etc.)


