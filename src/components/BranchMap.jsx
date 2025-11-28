import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import capitecBranch from '../assets/capitecBranch.jpg';


// Set a default center for the map (central)
const DEFAULT_CENTER = [-29.5, 24.5];

// Small helper that moves the map when a branch is selected
//makes use of time duration for smooth transition
const MapFlyToBranch = ({ branch }) => {  // receives selected branch
  const map = useMap();

  useEffect(() => {
    if (!branch) return;  // no branch selected, do nothing

    const { latitude, longitude } = branch.coordinates;  //extract coordinates
    map.flyTo([latitude, longitude], 17, {
      duration: 0.8, //duration in seconds can be edited when needed here
    });
  }, [branch, map]);

  return null;
};

// Resets map when resetToken changes (logo click), by clicking the logo 
const MapResetView = ({ resetToken }) => {
  const map = useMap();

  useEffect(() => {
    if (!resetToken) return; // ignore initial render

    map.flyTo(DEFAULT_CENTER, 6, {
      duration: 0.8, // reverse duration for reset, same smooth effect
    });
  }, [resetToken, map]);

  return null;
};

// Distance, simple flat-earth-ish approximation
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 111; // km per degree of latitude
  const x =
    (lon2 - lon1) *
    Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));  //making use of pythagorean theorem for calculating distance
  const y = lat2 - lat1;
  return Math.sqrt(x * x + y * y) * R;
};




export const BranchMap = ({ branches, resetToken }) => {
  const mapStyle = { height: '89.3vh', width: '100%' };  // map height and width, could be adjusted as needed, but should technically fit most screens

  // SEARCH state
  const [query, setQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Near me state
  const [userLocation, setUserLocation] = useState(null);
  const [closestBranches, setClosestBranches] = useState([]);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (!resetToken) return;   // ignore initial render

    // Reset all state on resetToken change
    setSelectedBranch(null);
    setUserLocation(null);
    setClosestBranches([]);
    setQuery('');
    setLocationError('');
  }, [resetToken]);

  const filteredBranches = useMemo(() => { // SEARCH filtering logic
    const q = query.trim().toLowerCase();
    if (!q) return [];    // if no query, return empty list
    return branches.filter((b) =>
      b.name.toLowerCase().includes(q)  // case-insensitive matching of branch names
    );
  }, [branches, query]);

  const handleSelectBranch = (branch) => {
    // Set the text in the search bar
    setQuery(branch.name);
    // Set the selected branch so MapFlyToBranch can move the map
    setSelectedBranch(branch);
  };


  //method for closest branches
  // using current user location, then loops through branches to calculate distance
  const updateClosestBranches = (location) => { //
    const withDistance = branches
      .map((b) => ({
        ...b,    //loop
        distanceKm: getDistanceKm(
          location.latitude,
          location.longitude,
          b.coordinates.latitude,
          b.coordinates.longitude  // compare against user location
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);   //keep list within 5 closest branches

    setClosestBranches(withDistance);
  };

  const handleUseMyLocation = () => {
    setLocationError('');  //reset error

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');  //check for browser support
      return;
    }

    navigator.geolocation.getCurrentPosition(  //get user location
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,  //store coordinates
          longitude: pos.coords.longitude,
        };
        setUserLocation(coords);
        updateClosestBranches(coords);
        setSelectedBranch(null);  //clear selected branch when using location
      },
      (err) => {
        setLocationError('Could not get your location. Please check permissions.');  //handle errors
        console.error(err);
      }
    );
  };

  const selectedBranchDistanceKm =  //calculate distance to selected branch if available
    selectedBranch && userLocation
      ? getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,  //user location
          selectedBranch.coordinates.latitude,
          selectedBranch.coordinates.longitude
        )
      : null;

  return (
    <div className="map-container">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={6}  //default zoom level
        minZoom={5}  //minimum zoom level
        maxZoom={18}  //maximum zoom level
        style={mapStyle}
        scrollWheelZoom={true}  //enable scroll zoom
      >
        {/* This component reacts to selectedBranch and flies the map */}
        <MapFlyToBranch branch={selectedBranch} />
        <MapResetView resetToken={resetToken} />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />

        {branches.map((branch) => (  //rendering branch markers
          <Marker
            key={branch.id}
            position={[
              branch.coordinates.latitude,
              branch.coordinates.longitude,
            ]}
            eventHandlers={{
              click: () => setSelectedBranch(branch), // clicking marker selects branch
            }}
          >
            <Popup>
              <strong>{branch.name}</strong>
              <br />
              Services: {branch.services ? branch.services.join(', ') : 'N/A'}  //display services if available
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
            onChange={(e) => {
              setQuery(e.target.value);
              // setSelectedBranch(null);
            }}
          />

          {query && (  //clear button
            <button
              className="map-clear-btn"
              onClick={() => {
                setQuery('');
                setSelectedBranch(null);  // also clear selected branch on clearing search
              }}
              type="button"
            >
              X
            </button>
          )}
        </div>

        {query && filteredBranches.length > 0 && (  //display search results
          <ul className="map-search-results">
            {filteredBranches.map((branch) => (   //list of matching branches
              <li
                key={branch.id}
                onClick={() => handleSelectBranch(branch)}  //select branch on click
              >
                {branch.name}
              </li>
            ))}
          </ul>
        )}

        {query && filteredBranches.length === 0 && (  //no results found
          <div className="map-search-no-results">
            No branches match "{query}"  
          </div>
           )}
   
        <button
          type="button"
          className="map-location-btn"
          onClick={handleUseMyLocation}  //handle "near me" button click
        >
          Find branches near me
        </button>
        {locationError && (
          <div className="location-error">{locationError}</div>
        )}
      </div>

       {selectedBranch && (  //selected branch info panel
        <div className="branch-info-panel">
          <button
            className="branch-info-close"
            onClick={() => setSelectedBranch(null)}
            type="button"
          >
            ✕
          </button>

          <img  //branch image
            src={capitecBranch}
            alt="Capitec branch"
            className="branch-info-image"
          />

          <h3 className="branch-info-title">{selectedBranch.name}</h3>

          <div className="branch-info-body">
            <p>
              <strong>Branch ID:</strong> {selectedBranch.id}
            </p>
            <p>
              <strong>Services:</strong>{' '}
              {selectedBranch.services
                ? selectedBranch.services.join(', ')
                : 'N/A'}
            </p>

            {selectedBranchDistanceKm != null && (
              <p>
                <strong>Approx. distance:</strong>{' '}
                {Math.round(selectedBranchDistanceKm)} km
              </p>
            )}
          </div>
        </div>
      )}

      {!selectedBranch && closestBranches.length > 0 && (  //closest branches info panel
        <div className="branch-info-panel">
          <button
            className="branch-info-close"
            onClick={() => setClosestBranches([])}  //close button
            type="button"
          >
            X
          </button>

          <h3 className="branch-info-title">Closest branches to you</h3>

          <div className="branch-info-body">  
            {userLocation && (
              <p style={{ marginBottom: '6px', fontSize: '0.8rem' }}>  
                Showing 5 closest branches (straight-line distance)
              </p>
            )}

            <ul className="nearest-list">
              {closestBranches.map((branch) => (
                <li
                  key={branch.id}
                  onClick={() => handleSelectBranch(branch)}
                >
                  <span className="nearest-name">{branch.name}</span>
                  <span className="nearest-distance">
                    {branch.distanceKm.toFixed(1)} km
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};