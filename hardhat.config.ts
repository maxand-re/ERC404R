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
      degenchain: "D956K22P8AQBGWB5Y6B4V3RAIJFA8IHKD3", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "degenchain",
        chainId: 666666666,
        urls: {
          apiURL: "https://explorer.degen.tips/api",
          browserURL: "https://explorer.degen.tips/"
        }
      }
    ]
  },
  defaultNetwork: "localhost",
  networks: {
    blast: {
      url: "https://blast.blockpi.network/v1/rpc/public",
      accounts: [
        //"63d43cc6462a70153a58e6cbeeeec356bdb0d1abada6c00bc49855fbcf530c02",
        "cbe86e41aceac64fb50c31c5ad577fd4d0aa6a9813db523ccd7d13892211df5f",
      ],
      
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
    },
    degenchain: {
      url: "https://rpc.degen.tips",
      accounts: [
          "cbe86e41aceac64fb50c31c5ad577fd4d0aa6a9813db523ccd7d13892211df5f",
          "5c5fdc219e729f99a2b1f2d982bfef2555361a130c0a8751079d8d42daacb18b"
          //"36bbe442580da5a2e9353ce72b7978fd54889e092707ada1506ed05bb8621c9d"
      ]
    }

  }
};
export default config;