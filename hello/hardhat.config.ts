import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"
import "dotenv/config"

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    l2: {
      url: process.env.L2_RPC!,
      accounts: [process.env.PRIV_KEY!],
    }
  }
};

export default config;
