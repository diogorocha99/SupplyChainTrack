require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: process.env.MNEMONIC // Wallet mnemonic seed phrase from MetaMask
        },
        providerOrUrl: process.env.INFURA_API_KEY, // Infura API for connecting to Sepolia
        numberOfAddresses: 4, // Generate 3 wallets (for producer, transporter, and retailer)
        shareNonce: true // Share the nonce across the wallets
      }),
      network_id: '11155111', // Sepolia network ID
    },
  },
  compilers: {
    solc: {
      version: "0.8.20", // Solidity version
    },
  },
};