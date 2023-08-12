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
    // super wallet's testnet
    swt: {
      url: process.env.L2_RPC!,
      accounts: [process.env.ADMIN_PRIVATE_KEY!],
    },
    // uses goerli or sepolia, check the .env
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC,
      accounts: [process.env.ADMIN_PRIVATE_KEY!],
    },
    goerli: {
      chainId: 5,
      url: "https://eth-goerli.public.blastapi.io",
      accounts: [process.env.ADMIN_PRIVATE_KEY!]
    },
    baseTestnet: {
      chainId: 84531,
      url: "https://goerli.base.org",
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
    },
    modeTestnet: {
      chainId: 919,
      url: "https://sepolia.mode.network",
      accounts: [process.env.ADMIN_PRIVATE_KEY],
    }
  }
};

export default config;
