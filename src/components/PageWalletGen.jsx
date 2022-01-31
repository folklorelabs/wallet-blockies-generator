import React, { useCallback, useEffect, useState } from 'react';
import Blockies from 'react-blockies';
import { ethers } from 'ethers';
import AnchorAddress from './AnchorAddress';

import './PageWalletGen.css';
import { apiGetAccountNonce } from '../service/ethApi';

function PageWalletGen() {
  const [randomWallets, setRandomWallets] = useState([]);
  const initFavs = JSON.parse(localStorage.getItem('favoriteWallets') || '[]');
  const [favoriteWallets, setFavoriteWallets] = useState(initFavs);
  const [usedWallets, setUsedWallets] = useState({});
  const [autoGen, setAutoGen] = useState(false);

  const genRow = useCallback(() => {
    const newWallets = [];
    for (let i = 0; i < 6; i += 1) {
      const wallet = ethers.Wallet.createRandom();
      newWallets.push([wallet.address, wallet.mnemonic.phrase]);
    }
    setRandomWallets([
      ...newWallets,
      ...randomWallets,
    ]);
  }, [randomWallets]);

  const updateUsed = useCallback(async () => {
    const promises = [];
    const addresses = [];
    for (let i = 0; i < randomWallets.length; i += 1) {
      const wallet = randomWallets[i];
      const walletAddress = wallet[0];
      if (typeof usedWallets[walletAddress] !== 'boolean') {
        promises.push(apiGetAccountNonce(walletAddress, 1));
        addresses.push(walletAddress);
      }
    }
    for (let i = 0; i < favoriteWallets.length; i += 1) {
      const wallet = favoriteWallets[i];
      const walletAddress = wallet[0];
      if (typeof usedWallets[walletAddress] !== 'boolean') {
        promises.push(apiGetAccountNonce(walletAddress, 1));
        addresses.push(walletAddress);
      }
    }
    if (!promises.length) return;
    const results = await Promise.all(promises);
    const used = {
      ...usedWallets,
    };
    for (let i = 0; i < results.length; i += 1) {
      used[addresses[i]] = !!results[i];
    }
    setUsedWallets(used);
  }, [randomWallets, favoriteWallets, usedWallets]);

  useEffect(() => {
    if (!autoGen) return null;
    const genInterval = setInterval(() => {
      genRow();
    }, 1000);
    return () => {
      clearInterval(genInterval);
    };
  }, [autoGen, genRow]);

  // useEffect(() => {
  //   updateUsed();
  // }, [updateUsed]);

  return (
    <div className="PageWalletGen RainbowBG">
      <div className="PageWalletGen-inner">
        <button
          type="button"
          onClick={() => genRow()}
        >
          gen row
        </button>
        <button
          type="button"
          onClick={() => setAutoGen(!autoGen)}
        >
          auto gen:
          {' '}
          {autoGen ? 'off' : 'on'}
        </button>
        <button
          type="button"
          onClick={async () => {
            await updateUsed();
          }}
        >
          check used
        </button>
        <div
          style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', maxWidth: '708px',
          }}
        >
          {randomWallets.map((wallet) => (
            <button
              key={wallet[0]}
              id={wallet[0]}
              type="button"
              style={{
                padding: '20px',
                borderWidth: 0,
                background: usedWallets[wallet[0]] ? 'red' : 'transparent',
              }}
              onClick={() => {
                const newFavs = [
                  ...favoriteWallets,
                  [wallet[0], wallet[1]],
                ];
                localStorage.setItem('favoriteWallets', JSON.stringify(newFavs));
                setFavoriteWallets(newFavs);
              }}
            >
              <input id={`mnemonic-${wallet[0]}`} style={{ display: 'none' }} defaultValue={wallet[1]} type="text" />
              <Blockies
                seed={wallet[0].toLowerCase()}
                scale={9}
              />
            </button>
          ))}
        </div>
        <div>
          <h1>SAVED</h1>
          {favoriteWallets.map((wallet) => (
            <div
              key={wallet[0]}
              style={{
                background: usedWallets[wallet[0]] ? 'red' : 'transparent',
              }}
            >
              <Blockies
                seed={wallet[0].toLowerCase()}
                scale={9}
              />
              <AnchorAddress address={wallet[0]} />
              <input
                id={`mnemonic-${wallet[0]}`}
                defaultValue={wallet[1]}
                type="text"
                disabled
              />
              <button
                type="button"
                onClick={() => {
                  const inputMnemonic = document.getElementById(`mnemonic-${wallet[0]}`);
                  inputMnemonic.select();
                  inputMnemonic.setSelectionRange(0, 99999);
                  navigator.clipboard.writeText(inputMnemonic.value);
                }}
              >
                copy
              </button>
              <button
                type="button"
                onClick={() => {
                  const newFavs = favoriteWallets.filter((fav) => fav[0] !== wallet[0]);
                  localStorage.setItem('favoriteWallets', JSON.stringify(newFavs));
                  setFavoriteWallets(newFavs);
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageWalletGen;
