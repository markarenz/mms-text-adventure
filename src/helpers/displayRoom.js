import { CARRIED, exitLabels } from '@src/constants';

const displayRoom = (output, gameState, gameData) => {
  let exitsText = '';
  const x = gameState?.currentRoom;
  // ITEM SLOT 9 IS DEDICATED TO ACTIVE LIGHT SOURCE
  if (gameState.darkFlag && gameState.items[9].loc !== CARRIED) {
    return `${output}\nIt is too dark. I cannot see.\n`;
  }
  for (let d = 1; d <= 6; d++) {
    if (gameData.rooms[x].exits[d] > 0) {
      exitsText = `${exitsText}${exitLabels[d]} `;
    }
  }
  const roomName = gameData.rooms[x].desc;
  if (roomName.charAt(0) === '*') {
    output = `${output}${roomName.replace('*', '')}\n`;
  } else {
    const startsWithVowel = ['a', 'e', 'i', 'o', 'u'].includes(
      roomName.charAt(0)?.toLowerCase()
    );
    output = `${output}I am in ${startsWithVowel ? 'an' : 'a'} ${roomName}.\n`;
  }
  if (exitsText !== '') {
    output = `${output}\nObvious Exits: ${exitsText}`;
  }
  let itemsInRoom = '';
  for (let i = 0; i < gameState.items.length; i++) {
    if (gameState.items[i].loc === x) {
      itemsInRoom = `${itemsInRoom}${itemsInRoom !== '' ? ', ' : ''}${
        gameData.items[i].desc
      }`;
    }
  }
  return `${output}\nItems: ${itemsInRoom !== '' ? itemsInRoom : 'None'}\n\n`;
};

export default displayRoom;
