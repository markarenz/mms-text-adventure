import { noComprendeMessages, takeErrorMsg, CARRIED } from '@src/constants';
import {
  getInventory,
  getInventoryCount,
  loadGame,
  saveGame,
  displayRoom,
  performAction,
  showScore,
  getNounVerbFromInput,
  getWordsFromInput,
  // processInput,
} from '@src/helpers';

const playerTurn = (
  s,
  updateStdOutput,
  gameState,
  gameData,
  setGameState,
  triggerLoadDisplay
) => {
  let output = '';
  let shouldDrawRoom = false;
  let forceDisplayRoomDesc = false;
  let outputMode = 'append';
  let newGameState = { ...gameState };
  const oldInvCount = getInventoryCount(gameState, gameData.items.length);
  const oldCurrentRoom = gameState.currentRoom;
  const { numTurns } = gameState;
  let vc = null;
  let nc = null;

  if (s.length > 0) {
    // 0. PARSE INPUT
    const { verb, noun } = getNounVerbFromInput(s);
    output = `${output}> ${s}\n`;
    // 1. EXPLICIT COMMANDS
    if (s.includes('SCORE')) {
      output = `${output}${showScore(newGameState, gameData)}`;
      vc = 999;
    }
    if (s.includes('LOAD GAME')) {
      const loadResult = loadGame(
        s,
        newGameState,
        gameData,
        output,
        shouldDrawRoom,
        outputMode,
        triggerLoadDisplay
      );
      newGameState = loadResult.newGameState;
      output = loadResult.output;
      shouldDrawRoom = loadResult.shouldDrawRoom;
      outputMode = 'append';
      vc = 999;
    }
    if (s.includes('SAVE GAME')) {
      const saveResult = saveGame(
        s,
        newGameState,
        gameData,
        output,
        triggerLoadDisplay
      );
      output = saveResult.output;
      vc = 999; // Skip "Not understood" messaging
    }
    // 2. LOOK FOR SYNONYMS IN WORDS ARRAYS
    const wordLookupResult = getWordsFromInput(verb, noun, gameData);
    nc = wordLookupResult.nc;
    vc = wordLookupResult.vc;

    // 3. SIMPLE DIRECTIONAL COMMANDS
    if (noun === verb && verb === 'INV') {
      s = 'I';
    }
    if (s.length === 1) {
      switch (s) {
        case 'N':
          nc = 1;
          break;
        case 'S':
          nc = 2;
          break;
        case 'E':
          nc = 3;
          break;
        case 'W':
          nc = 4;
          break;
        case 'U':
          nc = 5;
          break;
        case 'D':
          nc = 6;
          break;
        case 'I':
          output = getInventory(output, newGameState, gameData);
          nc = 0;
          vc = 0;
          break;
        default:
          break;
      }
    }
    if (nc > 0 && nc < 7) {
      vc = 1; // If noun is direction, verb must be GO
    }
    // 4. COMMAND NOT UNDERSTOOD
    if (vc === null) {
      const rndIdx = Math.floor(Math.random() * noComprendeMessages.length);
      output = `${output}\n${noComprendeMessages[rndIdx]}\n`;
    }
    // 5. GO
    if (vc === 1) {
      if (nc > 0 && nc < 7) {
        if (gameData.rooms[newGameState.currentRoom].exits[nc] > 0) {
          newGameState.currentRoom =
            gameData.rooms[newGameState.currentRoom].exits[nc];
          outputMode = 'clear';
          shouldDrawRoom = true;
        } else {
          if (newGameState.darkFlag && newGameState.items[9].loc !== CARRIED) {
            // Moving around in the dark without a flashlight or lit torch is very dangerous
            output = `${output}I have fallen in the dark and broken my neck...\nI have died.\n`;
            newGameState.currentRoom = gameData.rooms.length;
          } else {
            output = `${output}I cannot go that way.\n`;
          }
        }
      } else {
        if (nc === null) {
          output = `${output}You need to give me a direction, too.\n`;
        }
      }
    }
    // 6. TAKE
    if (vc === 10) {
      let itemsCarried = 0;
      let i = 0;
      if (nc > 0) {
        for (let x = 1; x < gameData.items.length; x++) {
          if (newGameState.items[x].loc === CARRIED) {
            itemsCarried = itemsCarried + 1;
          }
          if (
            newGameState.items[x].loc === newGameState.currentRoom &&
            gameData.items[x].short === gameData.nouns[nc]
          ) {
            i = x;
          }
        }
        if (i > 0 && itemsCarried < gameData.headers.maxCarry + 1) {
          if (!gameData.items[i].fakeTake) {
            newGameState.items[i].loc = CARRIED;
            output = `${output}OK. TAKEN.\n`;
          }
        } else {
          if (itemsCarried > gameData.headers.maxCarry) {
            output = `${output}You are carrying too much stuff.\n`;
          } else {
            // Only display message if "TAKE NOUN" is not acted upon
            output = `${output}${takeErrorMsg}`;
          }
        }
      } else {
        output = `${output}What do you want me to take?\n`;
      }
    }
    // 7. DROP
    if (vc === 18) {
      for (let x = 1; x < gameData.items.length; x++) {
        if (
          newGameState.items[x].loc === CARRIED &&
          (noun === 'ALL' || gameData.items[x].short === gameData.nouns[nc])
        ) {
          newGameState.items[x].loc = newGameState.currentRoom;
        }
      }
      output = `${output}OK. DROPPED.\n`;
    }
    // 8. LOOK
    if (vc === 27) {
      outputMode = 'clear';
      shouldDrawRoom = true;
      forceDisplayRoomDesc = true;
    }
    // 9. ACTIONS
    let tmpVocab = vc * 150 + nc;
    const actions2do = [];
    for (let x = 0; x < gameData.vocab.length; x++) {
      if (gameData.vocab[x].matches.includes(tmpVocab)) {
        actions2do.push({ ...gameData.vocab[x], event: false });
      }
    }
    // 10. EVENTS
    gameData.events.map((e, idx) => {
      const diceRoll = Math.floor(Math.random() * 100);
      if (diceRoll < e.prob) {
        actions2do.push({ ...e, event: true });
      }
      return null;
    });

    // 11. PROCESS ACTIONS
    let result = null;
    let stopThis = false;
    console.log('???', actions2do);
    actions2do.map((actionObj) => {
      if (!(stopThis && actionObj.event)) {
        result = performAction(
          actionObj,
          noun,
          outputMode,
          newGameState,
          gameState,
          gameData,
          shouldDrawRoom,
          s
        );
        stopThis = result.shouldStop;
        newGameState = { ...result.newGameState };
        outputMode = result.newOutputMode;
        shouldDrawRoom = result.shouldDrawRoom;
        output = `${output}${result.newOutput}`;
      }
      return null;
    });
    // Sometimes we change rooms magically and must redraw the room
    if (oldCurrentRoom !== newGameState.currentRoom && !shouldDrawRoom) {
      shouldDrawRoom = true;
    }
    if (shouldDrawRoom) {
      output = displayRoom(
        output,
        forceDisplayRoomDesc,
        newGameState,
        gameData
      );
    }
  } else {
    if (numTurns > 0) {
      output = 'Tell me what to do...\n';
    } else {
      outputMode = 'clear';
      output = `${output}<i>${gameData.headers.introText}</i>\n\n`;
      output = displayRoom(
        output,
        forceDisplayRoomDesc,
        newGameState,
        gameData
      );
    }
  }
  // If the inventory has changed on this turn, remove the take error message.
  const newInvCount = getInventoryCount(newGameState, gameData.items.length);
  if (oldInvCount !== newInvCount) {
    output = output.replace(takeErrorMsg, '');
  }
  // Mark room from previous turn as visited
  newGameState.rooms[gameState.currentRoom].visited = true;

  setGameState({
    ...newGameState,
    numTurns: numTurns + 1,
  });
  updateStdOutput(output, outputMode);
  return null;
};

export default playerTurn;
