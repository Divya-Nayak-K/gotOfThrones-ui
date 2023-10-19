import React, { useEffect, useState } from 'react';

export interface CharacterCardProps {
    character: Character;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onClose: () => void;
}

export interface Character {
    characterName: string;
    houseName: string;
    characterLink: string;
    nickName: string;
    characterImageThumb: string;
    characterImageFull: string;
    royal: boolean;

    // Add other character details
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isFavorite, onToggleFavorite, onClose }) => {
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    useEffect(() => {

        if (character !== null) {
            fetch(`http://localhost:8080/api/characters/card-info/${character.characterName}`)
                .then((response) => response.json())
                .then((data) => {
                    const characterData: Character = {
                        characterName: data.characterName,
                        characterImageFull: data.characterImageFull,
                        characterImageThumb: data.characterImageThumb,
                        characterLink: data.characterLink,
                        houseName: data.houseName,
                        nickName: data.nickName,
                        royal: data.royal
                    };
                    setSelectedCharacter(characterData);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [character]);

    return (
        <div className="character-card" >
            <button className="close-button" onClick={onClose}>
                Close
            </button>
            {isFavorite && <img src="https://www.svgrepo.com//show/164862/favorite.svg" className='fav-icon'/>}
            <span>
                <h2>{selectedCharacter?.characterName}</h2>
                <p>HouseName: {selectedCharacter?.houseName}</p>
                <p>NickName: {selectedCharacter?.nickName}</p>
                {selectedCharacter?.royal && (<p>Royal</p>)}
            </span>
            <img src={selectedCharacter?.characterImageFull} className='image-full' />
            <span><button onClick={onToggleFavorite}>
                {isFavorite ? 'Unmark as Favorite' : 'Mark as Favorite'}
            </button></span>
        </div>
    );
};

export default CharacterCard;
