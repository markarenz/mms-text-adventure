const reverseConditions = (
  inputReverseConditions,
  setConditions,
  setConditionVals
) => {
  try {
    const revCondArr = JSON.parse(inputReverseConditions);
    const condArr = [];
    const condValsArr = [];
    revCondArr.map((cx) => {
      const dv = Math.floor(cx / 20);
      const cv = cx % 20;
      condArr.push(cv);
      condValsArr.push(dv);
      return null;
    });
    setConditions([...condArr]);
    setConditionVals([...condValsArr]);
  } catch (err) {
    console.log(err);
  }
};

const reverseActions = (inputReverseActions, setActions) => {
  try {
    const actionArr = JSON.parse(inputReverseActions);
    const act = [];
    act[0] = Math.floor(actionArr[0] / 150);
    act[1] = Math.floor(actionArr[0] % 150);
    act[2] = Math.floor(actionArr[1] / 150);
    act[3] = Math.floor(actionArr[1] % 150);
    setActions([...act]);
  } catch (err) {
    console.log(err);
  }
};

const checkUsage = (gameData) => {
  const msgUsed = {};
  const bfUsed = {};
  const { vocab, events } = gameData;
  const combined = [...vocab, ...events];
  combined.map((v, idx) => {
    const { conditions, actions } = v;
    const params = [];
    conditions.map((cx) => {
      const dv = Math.floor(cx / 20);
      const cv = cx % 20;
      if (cv === 0 && dv !== 0) {
        params.push(dv);
      }
      return null;
    });
    const act = [];
    act[0] = Math.floor(actions[0] / 150);
    act[1] = Math.floor(actions[0] % 150);
    act[2] = Math.floor(actions[1] / 150);
    act[3] = Math.floor(actions[1] % 150);
    let paramCounter = 0;
    act.map((a) => {
      if (a < 52 || a > 101) {
        if (!msgUsed[a]) {
          msgUsed[a] = [];
        }
        msgUsed[a].push(idx);
      } else {
        if (a === 58) {
          bfUsed[params[paramCounter]] = true;
        }
        if ([52, 53, 54, 55, 58, 59, 60, 65, 74, 79, 82, 83].includes(a)) {
          paramCounter += 1;
        }
        if ([62, 72].includes(a)) {
          paramCounter += 2;
        }
      }
      return null;
    });
    return null;
  });
  const unusedMessages = [];
  let c = 0;
  Object.keys(msgUsed).map((k) => {
    if (k - c > 1) {
      const gapStart = parseFloat(c) + 1;
      const gapEnd = parseFloat(k) - 1;
      unusedMessages.push(
        gapStart === gapEnd ? gapEnd : `${gapStart} - ${gapEnd}`
      );
    }
    c = k;
    return null;
  });
  console.log('unusedMessages', unusedMessages);
  console.log('bitFlags used', bfUsed);
};

const fixGameSave = (saveNumInput, gameData) => {
  const n = parseInt(saveNumInput);
  const saveName = `save-${gameData.headers.slug}-${n}`;
  const savedDataTxt = localStorage.getItem(saveName);
  const savedData = JSON.parse(savedDataTxt);
  gameData.rooms.map((room, idx) => {
    if (!savedData.rooms[idx]) {
      savedData.rooms[idx] = room;
    }
    return null;
  });
  gameData.items.map((item, idx) => {
    if (!savedData.items[idx]) {
      savedData.items[idx] = item;
    }
    return null;
  });
  localStorage.setItem(saveName, JSON.stringify(savedData));
};

const getActionString = (actions) => {
  const actionsArr = [];
  actionsArr[0] = actions[0] * 150 + actions[1];
  actionsArr[1] = actions[2] * 150 + actions[3];
  return JSON.stringify(actionsArr);
};

const getFullVocab = (
  actions,
  inputBuffer,
  vocabId,
  getConditionString,
  getActionString
) => `\t\t\t"//": "${inputBuffer}",
\t\t\t"matches": [${vocabId}],
\t\t\t"conditions": ${getConditionString()},
\t\t\t"actions": ${getActionString(actions)}`;

export {
  reverseConditions,
  reverseActions,
  checkUsage,
  fixGameSave,
  getActionString,
  getFullVocab,
};
