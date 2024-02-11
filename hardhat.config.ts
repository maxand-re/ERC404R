import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { mnemonic } from "./secrets.json"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    }
  },
  defaultNetwork: "localhost",
  networks: {
    ganache: {
      url: "http://localhost:7545",
      accounts: { mnemonic: mnemonic }
    },
    sepolia: {
      url: "https://rpc2.sepolia.org",
      accounts: ["40c00ec5289bca5ad6999705bb872fe0e3766561176dc9a649e26c8610e38b91", "727ef8bf8a860652734a78ace23661245caffea767225a3a4a4443722ac00ad4"]
    },
    polygon: {
      url: "https://polygon-pokt.nodies.app",
      accounts: ["c3bc28af05373d28f91c08312ecffd21e05aebf031193aeb62871c3d8365d1c8"]
    }
  }
};
export default config;