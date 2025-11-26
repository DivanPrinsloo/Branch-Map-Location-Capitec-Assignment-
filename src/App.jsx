// src/App.jsx

import './App.css'; 
import { BranchMap } from './components/BranchMap';
import branchData from './data/branches.json'; // Import your mock data

function App() {
  // The imported JSON data is ready to use!
  const branches = branchData; 

  return (
    <div className="App">
      <header>
        <h1>Capitec Branch Locations</h1>
        <p>Find your nearest branch with detailed information</p>
      </header>
      <div className="content-area">
      <main style={{ padding: '0' }}>
        {/* Pass the branch data to the Map component */}
        <BranchMap branches={branches} />
      </main>
      </div>
    </div>
  );
}

export default App;