import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      forking: {
          url: 'https://1rpc.io/bnb',
          blockNumber: 26427751
      }
    }
  },
  gasReporter: {
    enabled: true
  }

};

export default config;
