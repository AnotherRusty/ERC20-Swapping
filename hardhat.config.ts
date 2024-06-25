import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

import { alchemyKey, apiKey, chainId, privateKey, rpcURL } from "./config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {},
    bsctest: {
      url: rpcURL.bsctest,
      chainId: chainId.bsctest,
      accounts: [privateKey],
    },
    sepolia: {
      url: rpcURL.sepolia,
      chainId: chainId.sepolia,
      accounts: [privateKey],
    },
  },
  etherscan: {
    apiKey: apiKey,
  },
};

export default config;
