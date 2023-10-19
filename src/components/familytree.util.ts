export interface Relation {
    character: string[];
    relation: string;
    relatedTo: string[];
}

export interface TreeNode {
    name: string;
    attributes: {
        relationType: string;
    };
    children?: TreeNode[];
}

export function getUniqueRelations(relations: Relation[]): Relation[] {
    const uniqueRelations: Record<string, Relation> = {};

    relations?.forEach((rel) => {
        const sortedCharacters = rel.character.concat(rel.relatedTo).sort().join(", ");
        const key = `${sortedCharacters}_${rel.relation}`;

        if (!uniqueRelations[key]) {
            uniqueRelations[key] = rel;
        }
    });

    return Object.values(uniqueRelations);
}


export function groupByFamily(relations: Relation[]): TreeNode {
    const familyTree: TreeNode = {
        name: 'Lysa Arryn',
        attributes: {
            relationType: ""
        }
    };
    const characterNodes: Record<string, TreeNode> = { 'Lysa Arryn': familyTree };

    relations.forEach((relation) => {
        const character = relation.character[0];
        const relatedCharacter = relation.relatedTo[0];
        const relationType = relation.relation;

        if (relationType === 'PARENT') {
            characterNodes[character] = characterNodes[character] || { name: character };
            characterNodes[relatedCharacter] = characterNodes[relatedCharacter] || { name: relatedCharacter, attributes: { relationType: relationType } };
            characterNodes[character].children = characterNodes[character].children || [];
            characterNodes[character].children?.push(characterNodes[relatedCharacter]);
        } else if (relationType === 'SIBLING' || relationType === 'MARRIED') {
            characterNodes[character] = characterNodes[character] || { name: character };

            if (!characterNodes[character].children) {
                characterNodes[character].children = [
                    { name: relatedCharacter, attributes: { relationType: relationType } }
                ];
            } else {
                characterNodes[character].children?.push({
                    name: relatedCharacter,
                    attributes: {
                        relationType: relationType
                    }
                });
            }
        }
    });

    return familyTree;
}

type Character = string;

export function findTopParent(data: Relation[]): Character[] {
    const parents: Record<Character, boolean> = {};
    const children: Record<Character, boolean> = {};
  
    // Build the parent-child relationship
    data.forEach((item) => {
      if (Array.isArray(item.relatedTo)) {
        item.relatedTo.forEach((related) => {
          children[related] = true;
        });
      }
    });
  
    // Identify the top-level parent
    data.forEach((item) => {
      if (!children[item.character[0]]) {
        parents[item.character[0]] = true;
      }
    });
  
    // Return an array of top-level parents
    return Object.keys(parents);
  }
  
  type Family = {
    character: Character;
    members: Character[];
  };

  export function groupByFamily2(data: Relation[]): Family[] {
    const familyMap = new Map<Character, Family>();
  
    data.forEach((item) => {
      const character = item.character[0];
  
      if (!familyMap.has(character)) {
        familyMap.set(character, {
          character: character,
          members: []
        });
      }
  
      const family = familyMap.get(character)!;
  
      if (Array.isArray(item.relatedTo)) {
        item.relatedTo.forEach((related) => {
          if (!family.members.includes(related)) {
            family.members.push(related);
          }
        });
      }
    });
    return Array.from(familyMap.values());
  }
  