import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import Web3 from 'web3';

const INFURA_ID = '6ae4bfa571f34170800e16cf72824270'; // process.env.INFRA_ID;

// export const BUTTPUNK_CONTRACT_MAP = {
//   1: '', // mainnet
//   3: '0x0562DB77A1EE69331e950e349C51365a60E4003D', // ropsten
//   4: '0x0cf1b2021721eacF33Bea056664f8018136b6105', // rinkeby
//   5: '', // goerli
//   42: '', // kavan
//   1337: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // localhost
// };

export const WEB3_MODAL = new Web3Modal({
  // cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

export async function connect() {
  const provider = await WEB3_MODAL.connect();
  await provider.enable();
  const web3 = new Web3(provider);
  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return {
    web3,
    provider,
  };
}

export async function clearModalCache() {
  await WEB3_MODAL.clearCachedProvider();
}

export async function disconnect(web3) {
  if (web3 && web3.currentProvider && web3.currentProvider.disconnect) {
    await web3.currentProvider.disconnect();
  }
  await clearModalCache();
}
