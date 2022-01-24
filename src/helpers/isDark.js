import { CARRIED } from '@src/constants';

const isDark = (gameState, gameData) =>
  (gameState.darkFlag || gameData.rooms[gameState.currentRoom]?.dark) &&
  gameState.items[gameData.headers.lightOnItemId].loc !== CARRIED;

export default isDark;
