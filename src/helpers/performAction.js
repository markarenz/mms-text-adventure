import { CARRIED, gameOverMessage } from '@src/constants';
// import { getInventory } from '@src/helpers';

const performAction = (
  actionObj,
  noun,
  outputMode,
  newGameState,
  oldGameState,
  gameData,
  newShouldDrawRoom,
  s
) => {
  let shouldStop = false;
  let newOutput = '';
  let earlyMessage = '';
  let lateMessage = '';
  let conditionPassed = true;
  let newOutputMode = outputMode;
  const param = [];
  for (let cc = 0; cc < 5; cc++) {
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
          if (newGameState.items[dv].loc !== CARRIED) {
            conditionPassed = false;
          }
          break;
        case 2: // ITEM IN CURRENT ROOM
          if (newGameState.items[dv].loc !== oldGameState.currentRoom) {
            conditionPassed = false;
          }
          break;
        case 3: // ITEM CARRIED OR IN ROOM
          if (
            newGameState.items[dv].loc !== CARRIED &&
            newGameState.items[dv].loc !== oldGameState.currentRoom
          ) {
            conditionPassed = false;
          }
          break;
        case 4: // PLAYER IN ROOM #
          if (oldGameState.currentRoom !== dv) {
            conditionPassed = false;
          }
          break;
        case 5: //ITEM NOT CARRIED
          if (newGameState.items[dv].loc === CARRIED) {
            conditionPassed = false;
          }
          break;
        case 6: // ITEM NOT IN ROOM OR CARRIED
          if (
            newGameState.items[dv].loc === CARRIED ||
            newGameState.items[dv].loc === oldGameState.currentRoom
          ) {
            conditionPassed = false;
          }
          break;
        case 7: // PLAYER NOT IN ROOM #
          if (newGameState.currentRoom === dv) {
            conditionPassed = false;
          }
          break;
        case 8: // BITFLAG IS SET
          if (!newGameState.bitFlags[dv]) {
            conditionPassed = false;
          }
          break;
        case 9: // BITFLAG IS NOT SET
          if (newGameState.bitFlags[dv]) {
            conditionPassed = false;
          }
          break;
        case 10: // SOMETHING CARRIED
          for (let x = 1; x < gameData.items.length; x++) {
            let itemFound = false;
            if (newGameState.items[x].loc === CARRIED) {
              itemFound = true;
            }
            if (!itemFound) {
              conditionPassed = false;
            }
          }
          break;
        case 11: // NOTHING CARRIED
          for (let x = 1; x < gameData.items.length; x++) {
            if (newGameState.items[x].loc === CARRIED) {
              conditionPassed = false;
            }
          }
          break;
        case 12: // ITEM NOT CARRIED OR IN ROOM
          if (
            newGameState.items[dv].loc === CARRIED ||
            newGameState.items[dv].loc === newGameState.currentRoom
          ) {
            conditionPassed = false;
          }
          break;
        case 13: // ITEM IN GAME
          if (newGameState.items[dv].loc < 1) {
            conditionPassed = false;
          }
          break;
        case 14: // ITEM NOT IN GAME
          if (newGameState.items[dv].loc > 0) {
            conditionPassed = false;
          }
          break;
        case 15: // TURN <=
          if (newGameState.numTurns > dv) {
            conditionPassed = false;
          }
          break;
        case 16: // TURN >=
          if (newGameState.numTurns < dv) {
            conditionPassed = false;
          }
          break;
        case 17: // ITEM IN ORIGINAL ROOM
          if (newGameState.items[dv].loc !== gameData.items[dv].loc) {
            conditionPassed = false;
          }
          break;
        case 18: // ITEM NOT IN ORIGINAL ROOM
          if (newGameState.items[dv].loc === gameData.items[dv].loc) {
            conditionPassed = false;
          }
          break;
        case 19: // TURN COUNTER =
          if (newGameState.numTurns !== dv) {
            conditionPassed = false;
          }
          break;
        default:
          break;
      }
    }
  }

  let pCounter = 0;
  if (conditionPassed) {
    if (actionObj.event) {
      // ONLY ONE EVENT PER TURN
      shouldStop = true;
    }
    const act = [];
    act[0] = Math.floor(actionObj.actions[0] / 150);
    act[1] = Math.floor(actionObj.actions[0] % 150);
    act[2] = Math.floor(actionObj.actions[1] / 150);
    act[3] = Math.floor(actionObj.actions[1] % 150);
    for (let i = 0; i < 4; i++) {
      if (act[i] > 0 && act[i] < 52) {
        // EARLY MESSAGE
        earlyMessage = `${earlyMessage}<i>${gameData.messages[act[i]]}</i>\n`;
      } else {
        if (act[i] > 101) {
          // LATE MESSAGE
          lateMessage = `${lateMessage}<i>${
            gameData.messages[act[i] - 50]
          }</i>\n`;
        } else {
          switch (act[i]) {
            case 52: // GET ITEM IF YOU AREN'T CARRYING TOO MUCH
              let numCarried = 0;
              for (let j = 0; j < gameData.items.length; j++) {
                if (newGameState.items[j].loc === CARRIED) {
                  numCarried = numCarried + 1;
                }
              }
              if (numCarried > gameData.headers.maxCarry) {
                newOutput = `${newOutput}You are carrying too much.\n`;
              } else {
                newGameState.items[param[pCounter]].loc = CARRIED;
                newOutput = `${newOutput}OK. You notice something has changed.\n`;
                newShouldDrawRoom = true;
                pCounter = pCounter + 1;
              }
              break;
            case 53: // DROP ITEM
              newGameState.items[param[pCounter]].loc =
                newGameState.currentRoom;
              pCounter = pCounter + 1;
              break;
            case 54: // MOVE PLAYER TO ROOM X
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
            case 59: // REMOVE ITEM FROM GAME(?)
              newGameState.items[param[pCounter]].loc = 0;
              pCounter = pCounter + 1;
              break;
            case 60: // UNSET BITFLAG[X]
              newGameState.bitFlags[param[pCounter]] = false;
              pCounter = pCounter + 1;
              break;
            case 61: // DEATH
              shouldStop = true;
              newOutput = `${newOutput}${gameData.headers.deathMessage}\n`;
              newOutput = `${newOutput}\n${gameOverMessage}\n`;
              shouldStop = true;
              newGameState.darkFlag = false;
              newGameState.gameActive = false;
              break;
            case 62: // ITEM X PUT IN ROOM Y
              newGameState.items[param[pCounter]].loc = param[pCounter + 1];
              pCounter = pCounter + 2;
              break;
            case 63: // GAME WON
              newOutput = `${newOutput}\n${gameData.headers.gameWonMessage}\n`;
              newOutput = `${newOutput}\n${gameOverMessage}\n`;
              shouldStop = true;
              newGameState.darkFlag = false;
              newGameState.gameActive = false;
              break;
            case 64: // REDRAW ROOM
              newShouldDrawRoom = true;
              break;
            // case 65: // SCORE -- DEPRICATED
            //   break;
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
              newOutputMode = 'clear';
              newShouldDrawRoom = true;
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
                newGameState.currentCounter = newGameState.currentCounter - 1;
              }
              break;
            case 78: // DISPLAY CURRENTCOUNTER
              newOutput = `${newOutput}${newGameState.currentCounter}\n`;
              break;
            case 79: // SET CURRENTCOUNTER VALUE
              newGameState.currentCounter = param[pCounter];
              pCounter = pCounter + 1;
              break;
            // case 80: // SWAP LOCATION WITH LOCATION-SWAP VALUE - DEPRECATED
            case 81: // SWAP COUNTER WITH BACKUP COUNTER
              console.log(
                'SWAP COUNTER WITH BACKUP COUNTER - NOT YET SUPPORTED'
              );
              break;
            case 82: // ADD X TO COUNTER
              newGameState.currentCounter =
                newGameState.currentCounter + param[pCounter];
              pCounter = pCounter + 1;
              break;
            case 83: // SUBTRACT X FRMO COUNTER
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
              shouldStop = true;
              break;
            default:
              break;
          }
        }
      }
    }
  }
  if (newGameState.lightTimer > 0) {
    newGameState.lightTimer = newGameState.lightTimer - 1;
  }
  return {
    newOutput: `${earlyMessage}${newOutput}${lateMessage}`,
    shouldStop,
    newGameState,
    newOutputMode,
    shouldDrawRoom: newShouldDrawRoom,
  };
};

export default performAction;
