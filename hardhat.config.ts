import { HardhatUserConfig } from "hardhat/config";
import { mnemonic } from "./secrets.json"
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

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
  sourcify: {
    enabled: true
  },
  etherscan: {
    apiKey: {
      blast: "D956K22P8AQBGWB5Y6B4V3RAIJFA8IHKD3", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL: "https://api.blastscan.io/api",
          browserURL: "https://blastscan.io/"
        }
      }
    ]
  },
  defaultNetwork: "localhost",
  networks: {
    blast: {
      url: "https://blast.blockpi.network/v1/rpc/public",
      accounts: ["63d43cc6462a70153a58e6cbeeeec356bdb0d1abada6c00bc49855fbcf530c02"],
      
    },
    ganache: {
      url: "http://localhost:8545",
      accounts: { mnemonic: mnemonic }
    },
    sepolia: {
      url: "https://rpc2.sepolia.org",
      accounts: ["40c00ec5289bca5ad6999705bb872fe0e3766561176dc9a649e26c8610e38b91", "727ef8bf8a860652734a78ace23661245caffea767225a3a4a4443722ac00ad4"]
    },
    polygon: {
      url: "https://polygon-pokt.nodies.app",
      accounts: ["c3bc28af05373d28f91c08312ecffd21e05aebf031193aeb62871c3d8365d1c8", "4b8ccba35b8aa8f1977abb6640e98acfce94c33b6d4d331c13855b05ebb9b05a"]
    }
  }
};
export default config;