# ERC20 Swapping Contract

## Overview
This project is a smart contract implementation that facilitates the swapping of Ether (ETH) to a specific ERC20 token. The contract leverages the Uniswap V2 Router to ensure fair and accurate swap rates. The project emphasizes safety, performance, upgradeability, usability, and code quality. The key features and instructions for deploying, upgrading, and testing the smart contract are outlined below.

## Safety and Trust Minimization

### Current Safeguards:
1. **Reentrancy Attack Prevention**: The smart contract is designed to stop reentrancy attacks, ensuring secure execution of functions.
2. **Ownership Control**: The `onlyOwner` modifier is implemented, allowing only the owner to perform specific actions and upgrade the original smart contract.
3. **Swap Mechanism**: The contract uses the Uniswap V2 Router to ensure a fair and correct rate for token swaps.

## Performance

### Deployment Gas Fee
- To view the gas fee consumed during the deployment of the smart contract, run the following command:
  ```bash
  npx hardhat run ./scripts/deploy.ts --network sepolia
  ```
- Alternatively, you can use:
  ```bash
  yarn deploy-sepolia
  ```
  or
  ```bash
  npm run deploy-sepolia
  ```
  
### Function Execution Gas Fee
- To check the gas fee for running the `swapEtherToToken` function, execute the following command after deploying the smart contract:
  ```bash
  npx ts-node scripts/calcSwapFee.ts
  ```
- Alternatively, you can use:
  ```bash
  yarn calc
  ```
  or
  ```bash
  npm run calc
  ```


## Upgradeability

- To upgrade the current smart contract, use the following command:
  ```bash
  npx hardhat run ./scripts/upgrade.ts --network sepolia
  ```
- Alternatively, you can use:
  ```bash
  yarn upgrade-sepolia
  ```
  or
  ```bash
  npm run upgrade-sepolia
  ```

## Usability and Interoperability

- The smart contract cannot be used as an Externally Owned Account (EOA).
- Other smart contracts can call the `swapEtherToToken` function, allowing for interoperability.

## Readability and Code Quality

### Code Comments
- Necessary comments have been added to the codebase to aid understanding.

### Testing
- While hardhat unit tests can be added, the smart contract interacts with decentralized exchanges (such as Uniswap V2), making unit tests with hardhat not feasible.

## Hint
- As you can see, the current codebase is configured to run on sepoila and bsc testnet.
To switch between these two networks, simply change `swapRouterAddresses` and `rpcURL` between sepolia and bsc net.