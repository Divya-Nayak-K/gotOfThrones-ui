import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import CharacterCard, { Character } from './CharacterCard';
import { Relation, TreeNode, findTopParent, getUniqueRelations, groupByFamily, groupByFamily2 } from './familytree.util';


const FamilyTree: React.FC<{ selectedHouseName: string }> = ({ selectedHouseName }) => {
    const [treeData, setTreeData] = useState<TreeNode | null>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);

    const toggleFavorite = () => {
        if (selectedCharacter) {
            if (favoriteCharacters.some((char) => char.characterName === selectedCharacter.characterName)) {
                setFavoriteCharacters(favoriteCharacters.filter((char) => char.characterName !== selectedCharacter.characterName));
            } else {
                setFavoriteCharacters([...favoriteCharacters, selectedCharacter]);
            }
        }
    };

    const handleNodeClick = (node: any, event: any) => {
        setSelectedCharacter({
            characterName: node.data.name,
            characterImageFull: '',
            characterImageThumb: '',
            characterLink: '',
            houseName: '',
            nickName: '',
            royal: false
        });
    };


    useEffect(() => {
        if (selectedHouseName) {
            fetch(`http://localhost:8080/api/characters/familytree/${selectedHouseName}`)
                .then((response) => response.json())
                .then((data) => {
                    const uniqueRelations: Relation[] = getUniqueRelations(data.children);
                    const topParent = findTopParent(uniqueRelations);
                    groupByFamily2(uniqueRelations);
                    const parsedData = groupByFamily(uniqueRelations);
                    setTreeData(parsedData);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [selectedHouseName]);

    const handleCharacterCardClose = () => {
        setSelectedCharacter(null);
    };
    const treeConfig = {
        translate: { x: 238, y: 70 }, // Set the initial translation (x, y)
        scaleExtent: { min: 0.1, max: 2.0 }, // Set the scaling limits
    };

    return (
        <>
            <div className='label'> Family tree for {selectedHouseName} </div>
            <div className="tree-container">
                {treeData &&
                    <Tree
                        data={treeData}
                        orientation="vertical" onNodeClick={handleNodeClick} 
                        transitionDuration={0} // To disable transitions
                        {...treeConfig} // Apply the tree configuration
                        draggable={false}
                    />}
            </div>
            <div>
                {selectedCharacter && (
                    <CharacterCard
                        character={selectedCharacter}
                        isFavorite={favoriteCharacters.some((char) => char.characterName === selectedCharacter.characterName)}
                        onToggleFavorite={toggleFavorite}
                        onClose={handleCharacterCardClose}

                    />
                )}
            </div>
        </>
    );
};

export default FamilyTree;