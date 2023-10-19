import React, { useState } from 'react';
import './App.css';
import HouseDropdown from './components/HouseDropdown';
import FamilyTree from './components/FamilyTree';

function App() {
  const [selectedHouseName, setSelectedHouseName] = useState<string>(''); // Manage the selected house name state

  const handleHouseSelection = (selectedHouse: string) => {
    console.log(`Selected house: ${selectedHouse}`);
    setSelectedHouseName(selectedHouse);
  }

  return (
    <div className="app-container">
      <HouseDropdown onSelectHouse={handleHouseSelection} />
      <FamilyTree selectedHouseName={selectedHouseName} /> {/* Pass the selected house name */}
    </div>
  );
}

export default App;
