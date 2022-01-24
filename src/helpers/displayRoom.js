import { exitLabels } from '@src/constants';
import { isDark } from '@src/helpers';

const displayRoom = (output, forceDisplayRoomDesc, gameState, gameData) => {
  let exitsText = '';
  const x = gameState?.currentRoom;
  if (isDark(gameState, gameData)) {
    return `${output}\nIt is too dark. I cannot see.\n`;
  }
  for (let d = 1; d <= 6; d++) {
    if (gameData.rooms[x].exits[d] > 0) {
      exitsText = `${exitsText}${exitsText.length > 0 ? ', ' : ''}${
        exitLabels[d]
      }`;
    }
  }
  const roomName = gameData.rooms[x].name;
  if (roomName.charAt(0) === '*') {
    output = `${output}${roomName.replace('*', '')}\n`;
  } else {
    output = `${output}I am ${roomName}.\n`;
  }
  if (
    (!gameState.rooms[gameState.currentRoom].visited || forceDisplayRoomDesc) &&
    gameData.rooms[gameState.currentRoom].desc
  ) {
    output = `${output}${gameData.rooms[gameState.currentRoom].desc}\n`;
  }
  if (exitsText !== '') {
    output = `${output}\nObvious Exits: ${exitsText}`;
  }
  let itemsInRoom = '';
  for (let i = 0; i < gameState.items.length; i++) {
    if (gameState.items[i].loc === x) {
      const conj = i === gameState.items.length - 1 ? ' and ' : ', ';
      itemsInRoom = `${itemsInRoom}${itemsInRoom !== '' ? conj : ''}${
        gameData.items[i].article
      } ${gameData.items[i].name}`;
    }
  }

  return `${output}\nItems: ${itemsInRoom !== '' ? itemsInRoom : 'None'}\n\n`;
};

export default displayRoom;
