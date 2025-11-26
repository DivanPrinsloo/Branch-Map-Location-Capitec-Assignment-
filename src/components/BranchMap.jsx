// src/components/BranchMap.jsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // **CRITICAL: Imports map styling**
import L from 'leaflet';

// Leaflet requires a fix for default marker icons in modern bundlers (like Vite)
// This code ensures the standard blue markers show up.
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
//   iconUrl: '/leaflet/images/marker-icon.png',
//   shadowUrl: '/leaflet/images/marker-shadow.png',
// });


// Set a default center for the map (e.g., central South Africa)
const DEFAULT_CENTER = [-29.5, 24.5];

// The component receives the array of branches as a prop
export const BranchMap = ({ branches }) => {
  // We set a fixed size for the map container using inline style
  const mapStyle = { height: '75vh', width: '100%'}; 

  return (
    <MapContainer 
      center={DEFAULT_CENTER} 
      zoom={5} 
      style={mapStyle} 
      scrollWheelZoom={true}
    >
      {/* TileLayer defines the actual map background (OpenStreetMap) */}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Map over the branches array to place a marker for each one */}
      {branches.map((branch) => (
        <Marker 
          key={branch.id} 
          position={[branch.coordinates.latitude, branch.coordinates.longitude]}
        >
          {/* Popup content displays when the user clicks the marker */}
          <Popup>
            <strong>{branch.name}</strong>
            <br />
            Services: {branch.services ? branch.services.join(', ') : 'N/A'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};