const getSaveSlot = (s) => {
  let saveSlot = 1;
  const saveSlotParam = parseInt(
    s.replace('LOAD GAME', '').replace('SAVE GAME', '')
  );
  if (Number.isInteger(saveSlotParam)) {
    saveSlot = saveSlotParam;
  }
  return saveSlot;
};

const loadGame = (
  s,
  newGameState,
  gameData,
  output,
  shouldDrawRoom,
  outputMode,
  triggerLoadDisplay
) => {
  triggerLoadDisplay(true, 'loading');
  const saveSlot = getSaveSlot(s);
  const saveName = `save-${gameData.headers.slug}-${saveSlot}`;
  const undoGameState = { ...newGameState };
  let loadError = false;
  try {
    const rawGameSave = window.localStorage.getItem(saveName);
    newGameState = JSON.parse(rawGameSave);
    if (!newGameState.currentRoom) {
      loadError = true;
    }
  } catch (err) {
    console.log('LOAD ERROR', err);
    loadError = true;
  }
  if (loadError) {
    newGameState = { ...undoGameState };
    output = `${output}Game Load failed.\n`;
    shouldDrawRoom = false;
    outputMode = 'append';
  } else {
    output = `${output}Game Loaded\n`;
    shouldDrawRoom = true;
    outputMode = 'clear';
  }
  return {
    newGameState,
    output,
    shouldDrawRoom,
  };
};
const saveGame = (s, newGameState, gameData, output, triggerLoadDisplay) => {
  triggerLoadDisplay(true, 'saving');
  const saveSlot = getSaveSlot(s);
  console.log('saving', gameData);
  const saveName = `save-${gameData.headers.slug}-${saveSlot}`;
  window.localStorage.setItem(saveName, JSON.stringify(newGameState));
  output = `${output}Saved.\n`;
  return {
    output,
  };
};
export { loadGame, saveGame };
