// src/App.jsx
import { useState } from 'react';
import './App.css';
import { BranchMap } from './components/BranchMap';
import branchData from './data/branches.json';
import logo from './assets/capitec.png';

function App() {
  const branches = branchData;

  const [resetToken, setResetToken] = useState(0);

  const handleLogoClick = () => {
    setResetToken((prev) => prev + 1);
  };



  return (
    <div className="App">
      <header className="app-header">
       <img
          src={logo}
          alt="Capitec logo"
          className="app-logo"
          onClick={handleLogoClick}
        />

        <div className="app-header-center">
          <h1>Capitec Branch Locations</h1>
          <p>Find your nearest branch with detailed information</p>
        </div>
      </header>

    
      <main className="map-wrapper">
         <BranchMap branches={branches} resetToken={resetToken} />
      </main>
    </div>
  );
}

export default App;
