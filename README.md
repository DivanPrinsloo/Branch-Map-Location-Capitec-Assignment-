# Capitec Branch Locator (React + Vite + Leaflet)

This project is an interactive **Capitec branch locator** built with React and Vite.  
It displays a map of South Africa with branch locations, allows users to search by branch name, click markers to view details, and optionally find the **5 closest branches** based on their current location.

The app is designed as a simple, focused prototype that demonstrates:

- Integrating **Leaflet** maps via **react-leaflet**
- Working with **mock JSON data** for branches
- Implementing **search**, **map interaction**, and **geolocation**
- Keeping the UI clean and minimal, similar to a real-world banking locator

---

## Features

- **Interactive Map**
  - Built with 'react-leaflet' and OpenStreetMap tiles
  - Panning and zooming with the mouse
  - Map constrained so it doesn’t loop infinitely left/right or even up/down

- **Branch Markers**
  - Each branch from 'branches.json' is rendered as a pin on the map
  - Clicking a marker opens an info popup and shows a detailed panel on the left

- **Search Bar**
  - Floating search bar overlay on top of the map
  - Type to filter branches by name
  - Click a result to:
    - Center and zoom the map on that branch
    - Show branch details (ID, services, image and location in distance) in a left-side info panel
  - Clear button ('X') to reset the search input

- **Nearest Branches (“Find branches near me”)**
  - Uses **browser geolocation** (via 'navigator.geolocation') to get the user’s location
  - Calculates approximate distance to each branch using a simple distance formula
  - Displays the **5 closest branches**, sorted by distance
  - Clicking a branch in this list:
    - Moves the map to that branch
    - Opens its detailed info panel
  - Shows approximate distance in km (straight-line estimate, not driving distance)

- **Reset View via Logo**
  - Clicking the Capitec logo in the header resets:
    - Map view (zoomed out to South Africa)
    - Search query
    - Selected branch
    - “Near me” state

---

## Tech Stack

- **React** (Vite + HMR)
- **Vite** (development server & build tool)
- **React Leaflet** ('react-leaflet') for map components
- **Leaflet** for map rendering and interactions
- **ESLint** with the default Vite React lint rules
- Plain **CSS** modules ('App.css', 'index.css') for styling

---

## Project Structure (simplified)

\test_envioroment\Branch-Map-Location-Capitec-Assignment->
src/
  assets/
    capitecBranch.jpg       # Image used in the branch info panel
    capitec.png        # Header logo 
  components/
    BranchMap.jsx           # Main map + search + geolocation logic
  data/
    branches.json           # Mock data: branch IDs, names, coordinates, services
  App.jsx                   # Top-level layout (header + BranchMap)
  main.jsx                  # React entry (Vite bootstrap)
  App.css                   # App-specific styling
  index.css                 # Global styles, base layout

  --- 

  ## How to run project

  
