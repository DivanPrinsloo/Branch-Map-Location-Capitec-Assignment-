// src/components/BranchMap.jsx

import { useState, useMemo } from 'react';    
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // **CRITICAL: Imports map styling**


// Set a default center for the map (e.g., central South Africa)
const DEFAULT_CENTER = [-29.5, 24.5];

// The component receives the array of branches as a prop
export const BranchMap = ({ branches }) => {
  // We set a fixed size for the map container using inline style
  const mapStyle = { height: '89.3vh', width: '100%'}; 

  //  SEARCH STATE
  const [query, setQuery] = useState('');

  const filteredBranches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return branches.filter((b) =>
      b.name.toLowerCase().includes(q)
    );
  }, [branches, query]);

  // (Optional) clicking result just fills the input for now – NO MAP MOVEMENT
  const handleSelectBranch = (branch) => {
    setQuery(branch.name);
  };

  return (
    <div className="map-container">
    <MapContainer 
      center={DEFAULT_CENTER} 
      zoom={6} 
      minZoom={5}
      maxZoom={18}
      style={mapStyle} 
      scrollWheelZoom={true}
    >
   
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
      />


      {branches.map((branch) => (
        <Marker 
          key={branch.id} 
          position={[branch.coordinates.latitude, branch.coordinates.longitude]}
        >
        
          <Popup>
              <strong>{branch.name}</strong>
              <br />
              Services: {branch.services ? branch.services.join(', ') : 'N/A'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    
      <div className="map-search-overlay">
        <div className="map-search-input-wrapper">  
          <input
            type="text"
            className="map-search-input"
            placeholder="Search for a branch..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />


          {query && (
            <button
              className="map-clear-btn"
              onClick={() => setQuery("")}
            >
              ✕
            </button>
          )}
        </div>
    
        {query && filteredBranches.length > 0 && (
          <ul className="map-search-results">
            {filteredBranches.map((branch) => (
              <li
                key={branch.id}
                onClick={() => handleSelectBranch(branch)}
              >
                {branch.name}
              </li>
            ))}
          </ul>
        )}

        {/* No results message */}
        {query && filteredBranches.length === 0 && (
          <div className="map-search-no-results">
            No branches match "{query}"
          </div>
        )}
      </div>
    </div>
  );
};