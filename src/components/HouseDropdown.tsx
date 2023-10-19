import React, { useEffect, useState } from 'react';

interface HouseDropdownProps {
    onSelectHouse: (selectedHouse: string) => void;
}

const HouseDropdown: React.FC<HouseDropdownProps> = ({ onSelectHouse }) => {
    const [houseNames, setHouseNames] = useState<string[]>([]);
    const [selectedHouse, setSelectedHouse] = useState<string>('');

    const API_URL = 'http://localhost:8080/api/characters/houses';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const responseData = await response.json();
                setHouseNames(responseData);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleHouseSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedHouse = event.target.value;
        setSelectedHouse(selectedHouse);
        onSelectHouse(selectedHouse);
    };

    return (
        <div className="house-dropdown">
            <label htmlFor="houseDropdown">Select a House: </label>
            <select
                id="houseDropdown"
                value={selectedHouse}
                onChange={handleHouseSelection}
            >
                <option value=""> -- Select a House -- </option>
                {houseNames.map((houseName) => (
                    <option key={houseName} value={houseName}>
                        {houseName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default HouseDropdown;
