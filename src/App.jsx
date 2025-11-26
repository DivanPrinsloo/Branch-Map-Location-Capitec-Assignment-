// src/App.jsx

import './App.css'; 
import { BranchMap } from './components/BranchMap';
import branchData from './data/branches.json'; // Import your mock data

function App() {
  // The imported JSON data is ready to use!
  const branches = branchData; 

  return (
    <div className="App">
      <header style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Capitec Branch Locator</h1>
        <p>Find your nearest branch with detailed information</p>
      </header>
      <main style={{ padding: '0', margin: '0' }}>
        {/* Pass the branch data to the Map component */}
        <BranchMap branches={branches} />
      </main>
    </div>
  );
}

export default App;