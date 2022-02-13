import './App.css';
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import PageWalletGen from './PageWalletGen';

function App() {
  return (
    <Router>
      <div className="App RainbowBG">
        <div className="App-inner">
          {/* <AppHeader className="App-header" /> */}
          <main className="App-main">
            <Routes>
              <Route
                exact
                path="/"
                element={<PageWalletGen />}
              />

            </Routes>
          </main>
        </div>
        <AppFooter className="App-footer" />
      </div>
    </Router>
  );
}

export default App;
