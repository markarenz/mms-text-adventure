import {
  noComprendeMessages,
  takeErrorMsg,
  gameOverMessage,
  CARRIED,
} from '@src/constants';
import {
  getInventory,
  getInventoryCount,
  loadGame,
  saveGame,
  displayRoom,
  showScore,
  getNounVerbFromInput,
  getWordsFromInput,
  isDark,
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
  let showGoError = false;
  let outputMode = 'append';
  let newGameState = { ...gameState };
  let showFailedActionsMsg = true;
  let commandUnderstood = false;
  const oldItems = [];
  gameState.items.map((i, idx) => {
    oldItems.push({ ...i });
    return null;
  });
  const oldBitFlags = [];
  gameState.bitFlags.map((i, idx) => {
    const newBitFlag = gameState.bitFlags[idx];
    oldBitFlags[idx] = newBitFlag;
    return null;
  });
  const prevGameState = {
    currentRoom: parseInt(gameState.currentRoom),
    numTurns: parseInt(gameState.numTurns),
    oldItems,
    oldBitFlags,
  };

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
      showFailedActionsMsg = false;
      commandUnderstood = true;
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
      showFailedActionsMsg = false;
      commandUnderstood = true;
      newGameState = loadResult.newGameState;
      output = loadResult.output;
      outputMode = 'clear';
      shouldDrawRoom = loadResult.shouldDrawRoom;
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
      showFailedActionsMsg = false;
      commandUnderstood = true;
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
          showFailedActionsMsg = false;
          commandUnderstood = true;
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
    if (!vc && !commandUnderstood) {
      showFailedActionsMsg = false;
      const rndIdx = Math.floor(Math.random() * noComprendeMessages.length);
      output = `${output}\n${noComprendeMessages[rndIdx]}\n`;
    }
    // 5. GO
    if (vc === 1) {
      if (nc > 0 && nc < 7) {
        showFailedActionsMsg = false;
        if (gameData.rooms[newGameState.currentRoom].exits[nc] > 0) {
          newGameState.currentRoom =
            gameData.rooms[newGameState.currentRoom].exits[nc];
          outputMode = 'clear';
          shouldDrawRoom = true;
        } else {
          if (
            (newGameState.darkFlag ||
              gameData.rooms[newGameState.currentRoom]?.dark) &&
            newGameState.items[gameData.headers.lightOnItemId].loc !== CARRIED
          ) {
            output = `${output}I have fallen in the dark and broken my neck... I have died.\nType QUIT to restart or pick another game.\n\n`;
            newGameState.currentRoom = gameData.rooms.length - 1;
          } else {
            showGoError = true;
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
      showFailedActionsMsg = false;
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
        if (i > 0 && itemsCarried < gameData.headers.maxCarry) {
          if (!gameData.items[i].fakeTake) {
            newGameState.items[i].loc = CARRIED;
            output = `${output}OK. TAKEN.\n`;
          }
        } else {
          if (itemsCarried >= gameData.headers.maxCarry) {
            output = `${output}I am carrying too much stuff.\n`;
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
      let foundItemToDrop = false;
      for (let x = 1; x < gameData.items.length; x++) {
        if (
          newGameState.items[x].loc === CARRIED &&
          (noun === 'ALL' || gameData.items[x].short === gameData.nouns[nc])
        ) {
          showFailedActionsMsg = false;
          foundItemToDrop = true;
          newGameState.items[x].loc = newGameState.currentRoom;
        }
      }
      if (foundItemToDrop) {
        output = `${output}OK. DROPPED.\n`;
      }
    }
    // 8. LOOK
    if (s === 'LOOK') {
      showFailedActionsMsg = false;
      outputMode = 'clear';
      shouldDrawRoom = true;
      forceDisplayRoomDesc = true;
      commandUnderstood = true;
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
    let stopThis = false;
    for (let aIdx = 0; aIdx < actions2do.length; aIdx++) {
      const actionObj = actions2do[aIdx];
      if (!(stopThis && actionObj.event)) {
        let newOutput = '';
        let earlyMessage = '';
        let lateMessage = '';
        let conditionPassed = true;
        const gameStateCheck = actionObj.event ? newGameState : prevGameState;
        const param = [];
        for (let cc = 0; cc < 7; cc++) {
          let cv, dv, cx;
          cx = actionObj.conditions[cc];
          if (cx > 0) {
            dv = Math.floor(cx / 20);
            cv = cx % 20;
            switch (cv) {
              case 0: // PARAM
                if (conditionPassed) {
                  param.push(dv);
                }
                break;
              case 1: // ITEM CARRIED
                if (prevGameState.oldItems[dv].loc !== CARRIED) {
                  conditionPassed = false;
                }
                break;
              case 2: // ITEM IN CURRENT ROOM
                if (
                  prevGameState.oldItems[dv].loc !== prevGameState.currentRoom
                ) {
                  conditionPassed = false;
                }
                break;
              case 3: // ITEM CARRIED OR IN ROOM
                if (
                  prevGameState.oldItems[dv].loc !== CARRIED &&
                  prevGameState.oldItems[dv].loc !== prevGameState.currentRoom
                ) {
                  conditionPassed = false;
                }
                break;
              case 4: // PLAYER IN ROOM #
                if (gameStateCheck.currentRoom !== dv) {
                  conditionPassed = false;
                }
                break;
              case 5: //ITEM NOT CARRIED
                if (prevGameState.oldItems[dv].loc === CARRIED) {
                  conditionPassed = false;
                }
                break;
              case 6: // ITEM NOT IN ROOM OR CARRIED
                if (
                  prevGameState.oldItems[dv].loc === CARRIED ||
                  prevGameState.oldItems[dv].loc === prevGameState.currentRoom
                ) {
                  conditionPassed = false;
                }
                break;
              case 7: // PLAYER NOT IN ROOM #
                if (prevGameState.currentRoom === dv) {
                  conditionPassed = false;
                }
                break;
              case 8: // BITFLAG IS SET
                if (!prevGameState.oldBitFlags[dv]) {
                  conditionPassed = false;
                }
                break;
              case 9: // BITFLAG IS NOT SET
                if (prevGameState.oldBitFlags[dv]) {
                  conditionPassed = false;
                }
                break;
              case 10: // SOMETHING CARRIED
                for (let x = 1; x < gameData.items.length; x++) {
                  let itemFound = false;
                  if (prevGameState.oldItems[x].loc === CARRIED) {
                    itemFound = true;
                  }
                  if (!itemFound) {
                    conditionPassed = false;
                  }
                }
                break;
              case 11: // NOTHING CARRIED
                for (let x = 1; x < gameData.items.length; x++) {
                  if (prevGameState.oldItems[x].loc === CARRIED) {
                    conditionPassed = false;
                  }
                }
                break;
              case 12: // ITEM NOT CARRIED OR IN ROOM
                if (
                  prevGameState.oldItems[dv].loc === CARRIED ||
                  prevGameState.oldItems[dv].loc === newGameState.currentRoom
                ) {
                  conditionPassed = false;
                }
                break;
              case 13: // ITEM IN GAME
                if (prevGameState.oldItems[dv].loc < 1) {
                  conditionPassed = false;
                }
                break;
              case 14: // ITEM NOT IN GAME
                if (prevGameState.oldItems[dv].loc > 0) {
                  conditionPassed = false;
                }
                break;
              case 15: // TURN <=
                if (prevGameState.numTurns > dv) {
                  conditionPassed = false;
                }
                break;
              case 16: // TURN >=
                if (prevGameState.numTurns < dv) {
                  conditionPassed = false;
                }
                break;
              case 17: // ITEM IN ORIGINAL ROOM
                if (prevGameState.oldItems[dv].loc !== gameData.items[dv].loc) {
                  conditionPassed = false;
                }
                break;
              case 18: // ITEM NOT IN ORIGINAL ROOM
                if (prevGameState.oldItems[dv].loc === gameData.items[dv].loc) {
                  conditionPassed = false;
                }
                break;
              case 19: // LIGHT TIMER STATE ( 0 = IS EMPTY, 1 = IS NOT EMPTY)
                if (dv === 0) {
                  if (newGameState.lightTimer > 0) {
                    conditionPassed = false;
                  }
                } else {
                  if (newGameState.lightTimer < 1) {
                    conditionPassed = false;
                  }
                }
                break;
              default:
                break;
            }
          }
        }
        let pCounter = 0;
        if (conditionPassed) {
          showFailedActionsMsg = false;
          if (actionObj.event) {
            // ONLY ONE EVENT PER TURN
            stopThis = true;
          }
          const act = [];
          act[0] = Math.floor(actionObj.actions[0] / 150);
          act[1] = Math.floor(actionObj.actions[0] % 150);
          act[2] = Math.floor(actionObj.actions[1] / 150);
          act[3] = Math.floor(actionObj.actions[1] % 150);
          for (let i = 0; i < 4; i++) {
            if (act[i] > 0 && act[i] < 52) {
              // EARLY MESSAGE
              earlyMessage = `${earlyMessage}<i>${
                gameData.messages[act[i]]
              }</i>\n\n`;
            } else {
              if (act[i] > 101) {
                // LATE MESSAGE
                lateMessage = `${lateMessage}<i>${
                  gameData.messages[act[i] - 50]
                }</i>\n\n`;
              } else {
                switch (act[i]) {
                  case 52: // GET ITEM IF YOU AREN'T CARRYING TOO MUCH
                    let numCarried = 0;
                    for (let j = 0; j < gameData.items.length; j++) {
                      if (newGameState.items[j].loc === CARRIED) {
                        numCarried = numCarried + 1;
                      }
                    }
                    if (numCarried >= gameData.headers.maxCarry) {
                      newOutput = `${newOutput}I am carrying too much.\n`;
                    } else {
                      newGameState.items[param[pCounter]].loc = CARRIED;
                      newOutput = `${newOutput}OK. You notice something has changed.\n`;
                      shouldDrawRoom = true;
                      pCounter = pCounter + 1;
                    }
                    break;
                  case 53: // DROP ITEM
                    newGameState.items[param[pCounter]].loc =
                      newGameState.currentRoom;
                    pCounter = pCounter + 1;
                    break;
                  case 54: // MOVE PLAYER TO ROOM X
                    outputMode = 'clear';
                    newGameState.currentRoom = param[pCounter];
                    pCounter = pCounter + 1;
                    break;
                  case 55: // REMOVE ITEM FROM GAME
                    newGameState.items[param[pCounter]].loc = 0;
                    pCounter = pCounter + 1;
                    break;
                  case 56: // SET DARK FLAG
                    newGameState.darkFlag = true;
                    break;
                  case 57: // UNSET DARK FLAG
                    newGameState.darkFlag = false;
                    break;
                  case 58: // SET BITFLAG[X]
                    newGameState.bitFlags[param[pCounter]] = true;
                    pCounter = pCounter + 1;
                    break;
                  case 59: // REMOVE ITEM FROM GAME
                    newGameState.items[param[pCounter]].loc = 0;
                    pCounter = pCounter + 1;
                    break;
                  case 60: // UNSET BITFLAG[X]
                    newGameState.bitFlags[param[pCounter]] = false;
                    pCounter = pCounter + 1;
                    break;
                  case 61: // DEATH
                    stopThis = true;
                    newOutput = `${newOutput}${gameData.headers.deathMessage}\n`;
                    newOutput = `${newOutput}\n${gameOverMessage}\n`;
                    newGameState.darkFlag = false;
                    newGameState.gameActive = false;
                    break;
                  case 62: // ITEM X PUT IN ROOM Y
                    newGameState.items[param[pCounter]].loc =
                      param[pCounter + 1];
                    pCounter = pCounter + 2;
                    break;
                  case 63: // GAME WON
                    newOutput = `${newOutput}\n${gameData.headers.gameWonMessage}\n\n`;
                    newOutput = `${newOutput}${showScore(
                      newGameState,
                      gameData
                    )}\n`;
                    newOutput = `${newOutput}\n${gameOverMessage}\n`;
                    stopThis = true;
                    newGameState.darkFlag = false;
                    newGameState.gameActive = false;
                    break;
                  case 64: // REDRAW ROOM
                    shouldDrawRoom = true;
                    break;
                  case 65: // MOVE ITEM X to CURRENT ROOM (REPURPOSED)
                    newGameState.items[param[pCounter]].loc =
                      prevGameState.currentRoom;
                    pCounter = pCounter + 1;
                    break;
                  // case 66: // INVENTORY - DEPRICATED
                  //   newOutput = getInventory(newOutput, newGameState, gameData);
                  //   break;
                  case 67: // SET BITFLAG 0
                    newGameState.bitFlags[0] = true;
                    break;
                  case 68: // CLEAR BITFLAG 0
                    newGameState.bitFlags[0] = false;
                    break;
                  case 69: // REFILL LAMP
                    newGameState.lightTimer = gameData.headers.lightTime + 1;
                    break;
                  case 70: // CLEAR SCREEN
                    outputMode = 'clear';
                    shouldDrawRoom = true;
                    break;
                  case 71: // SAVE GAME (NOT NEEDED)
                    break;
                  case 72: // SWAP ITEM LOCATIONS FOR ITEM X and ITEM Y
                    const tmpLoc1 = newGameState.items[param[pCounter]].loc;
                    const tmpLoc2 = newGameState.items[param[pCounter + 1]].loc;
                    newGameState.items[param[pCounter]].loc = tmpLoc2;
                    newGameState.items[param[pCounter + 1]].loc = tmpLoc1;
                    pCounter = pCounter + 2;
                    break;
                  case 73: // CONTINUE WITH NEXT LINE
                    break;
                  case 74: // TAKE ITEM (EVEN IF YOU ALREADY HAVE IT)
                    newGameState.items[param[pCounter]].loc = CARRIED;
                    pCounter = pCounter + 1;
                    break;
                  // case 75: // PUT ITEM X WITH Y - DEPRECATED
                  // case 76: // LOOK - DEPRECATED
                  case 77: // DECREMENT CURRENTCOUNTER
                    if (newGameState.currentCounter > 0) {
                      newGameState.currentCounter =
                        newGameState.currentCounter - 1;
                    }
                    break;
                  case 78: // DISPLAY CURRENTCOUNTER
                    newOutput = `${newOutput}${newGameState.currentCounter}\n`;
                    break;
                  case 79: // SET COUNTER VALUE
                    newGameState.currentCounter = param[pCounter];
                    pCounter = pCounter + 1;
                    break;
                  // case 80: // SWAP LOCATION WITH LOCATION-SWAP VALUE - DEPRECATED
                  case 81: // SWAP COUNTER WITH BACKUP COUNTER
                    break;
                  case 82: // ADD X TO COUNTER
                    newGameState.currentCounter =
                      newGameState.currentCounter + param[pCounter];
                    pCounter = pCounter + 1;
                    break;
                  case 83: // SUBTRACT X FROM COUNTER
                    newGameState.currentCounter =
                      newGameState.currentCounter - param[pCounter];
                    pCounter = pCounter + 1;
                    break;
                  case 84: // DISPLAY NOUN WITH NO LINEFEED
                    newOutput = `${newOutput}${noun} `;
                    break;
                  case 85: // DISPLAY NOUN USED WITH LINEFEED
                    newOutput = `${newOutput}${noun}$\n`;
                    break;
                  case 86: // LINEFEED
                    newOutput = `${newOutput}$\n`;
                    break;
                  // case 87: // SWAP CURRENT LOCATION WITH LOCATION-SWAP VALUE - DEPRECATED
                  // case 88: // WAIT... - DEPRECATED
                  // case 89: // DRAW PICTURE - DEPRECATED
                  case 90: // STOP SUBSEQUENT ACTIONS
                    stopThis = true;
                    break;
                  default:
                    break;
                }
              }
            }
          }
        }

        output = `${output}${earlyMessage}${newOutput}${lateMessage}`;
      }
    }

    const { lightOffItemId, lightOnItemId } = gameData.headers;
    if (
      newGameState.lightTimer > 0 &&
      newGameState.items[lightOnItemId].loc === CARRIED
    ) {
      if (newGameState.lightTimer === 1) {
        const tmpLoc = newGameState.items[lightOffItemId].loc;
        newGameState.items[lightOffItemId].loc =
          newGameState.items[lightOnItemId].loc;
        newGameState.items[lightOnItemId].loc = tmpLoc;
        output = `${output}Oh, dear. It appears the light has run out.\n`;
      } else if (newGameState.lightTimer % 5 === 0) {
        output = `${output}${newGameState.lightTimer} turns remain before the light runs out.\n`;
      }
      newGameState.lightTimer -= 1;
    }

    if (showFailedActionsMsg) {
      output = `${output}I am unable to do that at this time and in this place.\n`;
    }

    // Sometimes we change rooms magically and must redraw the room
    if (oldCurrentRoom !== newGameState.currentRoom && !shouldDrawRoom) {
      shouldDrawRoom = true;
    }
    if (shouldDrawRoom && newGameState.gameActive) {
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
      output = `"${output}${gameData.headers.title}" by ${gameData.headers.author}\n\n<i>${gameData.headers.introText}</i>\n\n`;
      output = displayRoom(
        output,
        forceDisplayRoomDesc,
        newGameState,
        gameData
      );
    }
  }
  if (showGoError && gameState.currentRoom === newGameState.currentRoom) {
    output = `${output}I cannot go that way.\n`;
  }
  const newInvCount = getInventoryCount(newGameState, gameData.items.length);
  if (oldInvCount !== newInvCount) {
    output = output.replace(takeErrorMsg, '');
  }
  if (!isDark(newGameState, gameData)) {
    newGameState.rooms[gameState.currentRoom].visited = true;
  }
  newGameState.commandLog = [...newGameState.commandLog, s];
  setGameState({
    ...newGameState,
    numTurns: numTurns + 1,
  });
  updateStdOutput(output, outputMode);
  return null;
};

export default playerTurn;
