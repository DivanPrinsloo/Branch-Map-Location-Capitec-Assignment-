// src/components/BranchMap.jsx

import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Set a default center for the map (e.g., central South Africa)
const DEFAULT_CENTER = [-29.5, 24.5];

// Small helper that moves the map when a branch is selected
const MapFlyToBranch = ({ branch }) => {
  const map = useMap();

  useEffect(() => {
    if (!branch) return;

    const { latitude, longitude } = branch.coordinates;
    map.flyTo([latitude, longitude], 14, {
      duration: 0.8,
    });
  }, [branch, map]);

  return null;
};

export const BranchMap = ({ branches }) => {
  const mapStyle = { height: '89.3vh', width: '100%' };

  // SEARCH STATE
  const [query, setQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);

  const filteredBranches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return branches.filter((b) =>
      b.name.toLowerCase().includes(q)
    );
  }, [branches, query]);

  const handleSelectBranch = (branch) => {
    // Set the text in the search bar
    setQuery(branch.name);
    // Set the selected branch so MapFlyToBranch can move the map
    setSelectedBranch(branch);
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
        {/* This component reacts to selectedBranch and flies the map */}
        <MapFlyToBranch branch={selectedBranch} />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />

        {branches.map((branch) => (
          <Marker
            key={branch.id}
            position={[
              branch.coordinates.latitude,
              branch.coordinates.longitude,
            ]}
          >
            <Popup>
              <strong>{branch.name}</strong>
              <br />
              Services: {branch.services ? branch.services.join(', ') : 'N/A'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 🔹 Floating search UI */}
      <div className="map-search-overlay">
        <div className="map-search-input-wrapper">
          <input
            type="text"
            className="map-search-input"
            placeholder="Search for a branch..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // When user starts typing again, we don't *have* to clear selectedBranch,
              // but you can if you want:
              // setSelectedBranch(null);
            }}
          />

          {query && (
            <button
              className="map-clear-btn"
              onClick={() => {
                setQuery('');
                setSelectedBranch(null);
              }}
              type="button"
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

        {query && filteredBranches.length === 0 && (
          <div className="map-search-no-results">
            No branches match "{query}"
          </div>
        )}
      </div>
    </div>
  );
};
