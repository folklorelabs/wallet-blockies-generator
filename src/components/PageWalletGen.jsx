import React, { useState } from 'react';
import Blockies from 'react-blockies';
import { ethers } from 'ethers';
import AnchorAddress from './AnchorAddress';

import './PageWalletGen.css';

function PageWalletGen() {
  const [randomWallets, setRandomWallets] = useState([]);
  const initFavs = JSON.parse(localStorage.getItem('favoriteWallets') || '[]');
  const [favoriteWallets, setFavoriteWallets] = useState(initFavs);
  const [numNewWallets, setNumNewWallets] = useState(22);

  return (
    <div className="PageWalletGen RainbowBG">
      <div className="PageWalletGen-inner">
        <input value={numNewWallets} onChange={(e) => setNumNewWallets(e.target.value)} />
        <button
          type="button"
          onClick={() => {
            const newWallets = [];
            for (let i = 0; i < numNewWallets; i += 1) {
              newWallets.push(ethers.Wallet.createRandom());
            }
            setRandomWallets([
              ...newWallets,
              ...randomWallets,
            ]);
          }}
        >
          new
        </button>
        <div
          style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%',
          }}
        >
          {randomWallets.map((wallet) => (
            <button
              key={wallet.address}
              id={wallet.address}
              type="button"
              style={{ padding: '20px', border: 0, background: 'none' }}
              onClick={() => {
                const newFavs = [
                  ...favoriteWallets,
                  [wallet.address, wallet.mnemonic.phrase],
                ];
                localStorage.setItem('favoriteWallets', JSON.stringify(newFavs));
                setFavoriteWallets(newFavs);
              }}
            >
              <input id={`mnemonic-${wallet.address}`} style={{ display: 'none' }} value={wallet.mnemonic.phrase} type="text" />
              <Blockies
                seed={wallet.address.toLowerCase()}
                scale={9}
              />
            </button>
          ))}
        </div>
        <div>
          {favoriteWallets.map((wallet) => (
            <div>
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
