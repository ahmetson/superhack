import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"
import "dotenv/config"
import "@hyperlane-xyz/core";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    // super wallet's super bridge
    l2: {
      url: process.env.L2_RPC!,
      accounts: [process.env.ADMIN_PRIVATE_KEY!],
    },
    // uses sepolia
    l1: {
      chainId: 111551111,
      url: process.env.L1_RPC!,
      accounts: [process.env.ADMIN_PRIVATE_KEY!],
    },
    baseTestnet: {
      chainId: 84531,
      url: "https://1rpc.io/base-goerli",
      accounts: [process.env.ADMIN_PRIVATE_KEY],
    },
    zoraTestnet: {
      chainId: 999,
      url: "https://testnet.rpc.zora.energy",
      accounts: [process.env.ADMIN_PRIVATE_KEY],
    },
    opTestnet: {
      chainId: 420,
      url: "https://goerli.optimism.io",
      accounts: [process.env.ADMIN_PRIVATE_KEY],
    }
  }
};

export default config;
