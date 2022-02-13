import React, { useCallback, useEffect, useState } from 'react';
import Blockies from 'react-blockies';
import { ethers } from 'ethers';
import classnames from 'classnames';
import AnchorAddress from './AnchorAddress';

import './PageWalletGen.css';
// import { apiGetAccountNonce } from '../service/ethApi';

const NEW_ROW_COUNT = 8;
const MAX_WALLETS_VISIBLE = 32;

function PageWalletGen() {
  const [randomWallets, setRandomWallets] = useState([]);
  const initFavs = JSON.parse(localStorage.getItem('favoriteWallets') || '[]');
  const [favoriteWallets, setFavoriteWallets] = useState(initFavs);
  const [usedWallets] = useState({});
  const [autoGen] = useState(false);

  const genRow = useCallback(() => {
    const newRandomWallets = [];
    for (let i = 0; i < NEW_ROW_COUNT; i += 1) {
      const wallet = ethers.Wallet.createRandom();
      newRandomWallets.push([wallet.address, wallet.mnemonic.phrase]);
    }
    const oldWalletsTargetLength = MAX_WALLETS_VISIBLE - NEW_ROW_COUNT;
    setRandomWallets([
      ...newRandomWallets,
      ...randomWallets.slice(0, oldWalletsTargetLength),
    ]);
  }, [randomWallets]);

  // const updateUsed = useCallback(async () => {
  //   const promises = [];
  //   const addresses = [];
  //   for (let i = 0; i < randomWallets.length; i += 1) {
  //     const wallet = randomWallets[i];
  //     const walletAddress = wallet[0];
  //     if (typeof usedWallets[walletAddress] !== 'boolean') {
  //       promises.push(apiGetAccountNonce(walletAddress, 1));
  //       addresses.push(walletAddress);
  //     }
  //   }
  //   for (let i = 0; i < favoriteWallets.length; i += 1) {
  //     const wallet = favoriteWallets[i];
  //     const walletAddress = wallet[0];
  //     if (typeof usedWallets[walletAddress] !== 'boolean') {
  //       promises.push(apiGetAccountNonce(walletAddress, 1));
  //       addresses.push(walletAddress);
  //     }
  //   }
  //   if (!promises.length) return;
  //   const results = await Promise.all(promises);
  //   const used = {
  //     ...usedWallets,
  //   };
  //   for (let i = 0; i < results.length; i += 1) {
  //     used[addresses[i]] = !!results[i];
  //   }
  //   setUsedWallets(used);
  // }, [randomWallets, favoriteWallets, usedWallets]);

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
    <div className="PageWalletGen">
      <div className="PageWalletGen-inner">
        <div className="PageWalletGen-section">
          <h1 className="PageWalletGen-headline">Wallet Generator</h1>
          <p>
            Click the button to start generating rows of potential wallets.
            <br />
            Click on wallets you like to save them below.
          </p>
        </div>
        <div className="PageWalletGen-section">
          {!autoGen ? (
            <button
              className="Button"
              type="button"
              onClick={() => genRow()}
            >
              Generate
              {' '}
              {NEW_ROW_COUNT}
              {' '}
              blockies
            </button>
          ) : ''}
        </div>
        {/* <div className="PageWalletGen-section">
          <button
            className={classnames(
              'Button',
              {
                'Button--loading': autoGen,
              },
            )}
            type="button"
            onClick={() => setAutoGen(!autoGen)}
          >
            {autoGen ? 'Stop generating continously' : 'Generate continuously'}
          </button>
        </div> */}
        <div className="PageWalletGen-section RandomWalletList">
          {randomWallets.map((wallet) => (
            <button
              className={classnames(
                'RandomWallet',
                {
                  'RandomWallet--used': usedWallets[wallet[0]],
                  'RandomWallet--favorite': favoriteWallets.find((fw) => fw[0] === wallet[0]),
                },
              )}
              key={wallet[0]}
              id={wallet[0]}
              type="button"
              onClick={() => {
                const favIndex = favoriteWallets.findIndex((w) => w[0] === wallet[0]);
                const newFavs = favIndex < 0 ? [
                  ...favoriteWallets,
                  [wallet[0], wallet[1]],
                ] : [
                  ...favoriteWallets.slice(0, favIndex),
                  ...favoriteWallets.slice(favIndex + 1),
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
        {favoriteWallets.length ? (
          <div>
            <h1>SAVED WALLETS</h1>
            {/* <button
              type="button"
              onClick={async () => {
                await updateUsed();
              }}
            >
              check if any saved wallets have been used
            </button> */}
            {favoriteWallets.map((wallet) => (
              <div
                className="FavoriteWallet"
                key={wallet[0]}
                style={{
                  background: usedWallets[wallet[0]] ? 'red' : 'transparent',
                  display: 'flex',
                }}
              >
                <Blockies
                  seed={wallet[0].toLowerCase()}
                  scale={9}
                />
                <div style={{ textAlign: 'left', marginLeft: '5px' }}>
                  <div>
                    <AnchorAddress address={wallet[0]} />
                  </div>
                  <div>
                    <input
                      id={`mnemonic-${wallet[0]}`}
                      defaultValue={wallet[1]}
                      type="text"
                      disabled
                    />
                    <button
                      className="AnchorLink"
                      type="button"
                      onClick={() => {
                        const inputMnemonic = document.getElementById(`mnemonic-${wallet[0]}`);
                        inputMnemonic.select();
                        inputMnemonic.setSelectionRange(0, 99999);
                        navigator.clipboard.writeText(inputMnemonic.value);
                      }}
                    >
                      copy secret phrase
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        const newFavs = favoriteWallets.filter((fav) => fav[0] !== wallet[0]);
                        localStorage.setItem('favoriteWallets', JSON.stringify(newFavs));
                        setFavoriteWallets(newFavs);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'red',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      unfavorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : ''}
      </div>
    </div>
  );
}

export default PageWalletGen;
