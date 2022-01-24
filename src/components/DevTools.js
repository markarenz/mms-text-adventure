import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { conditionsList, actionsList } from '@src/constants';
import {
  getNounVerbFromInput,
  getWordsFromInput,
  reverseConditions,
  reverseActions,
} from '@src/helpers';
const DevTools = ({ gameData }) => {
  const defaultConditions = [0, 0, 0, 0, 0, 0, 0]; // 2 extra
  const defaultActions = [0, 0, 0, 0];
  const [inputBuffer, setInputBuffer] = useState('');
  const [inputReverseConditions, setInputReverseConditions] = useState('');
  const [inputReverseActions, setInputReverseActions] = useState('');
  const [vocabId, setVocabId] = useState(0);
  const [saveNumInput, setSaveNumInput] = useState('1');
  const [conditions, setConditions] = useState([...defaultConditions]);
  const [conditionVals, setConditionVals] = useState([...defaultConditions]);
  const [actions, setActions] = useState([...defaultActions]);

  const handleInputCheck = () => {
    const { verb, noun } = getNounVerbFromInput(inputBuffer);
    const { vc, nc } = getWordsFromInput(verb, noun, gameData);
    const tmpVocab = vc * 150 + nc;
    setVocabId(tmpVocab);
  };
  const handleUserInputKeydown = (e) => {
    if (e.which === 13) {
      handleInputCheck();
    }
  };
  const handleInputChange = (e) => {
    setInputBuffer(e.target.value.toUpperCase());
  };
  const handleConditionChange = (e) => {
    const idx = parseInt(e.target.name.replace('condition-', ''));
    const newConditions = conditions.map((c, i) =>
      i === idx ? parseInt(e.target.value) : c
    );
    setConditions([...newConditions]);
  };
  const ConditionDropDown = ({ i }) => {
    return (
      <select
        name={`condition-${i}`}
        value={conditions[i]}
        onChange={handleConditionChange}
      >
        <option value="">NONE SELECTED</option>
        {conditionsList.map((c, idx) => (
          <option
            value={idx}
            key={`condition-option-${i}-${idx}`}
            // SELECTED={conditions[i] === c}
          >
            {idx === 0 && conditionVals[i] === 0 ? '' : c}
          </option>
        ))}
      </select>
    );
  };

  const actionsListArr = [];
  const actionsListKeys = Object.keys(actionsList);
  const actionsListVals = Object.values(actionsList);
  actionsListKeys.map((i, idx) => {
    actionsListArr[i] = actionsListVals[idx];
    return null;
  });
  const messagesKeys = Object.keys(gameData.messages);
  messagesKeys.map((idx) => {
    const m = gameData.messages[idx];
    const n = parseInt(idx);
    if (m !== '') {
      const breakpoint = 51;
      const i = n > 0 && n < breakpoint ? n : n + 50;
      actionsListArr[i] = `MESSAGE (${i}): (${
        i < breakpoint ? 'EARLY' : 'LATE'
      }) ${m}`;
    }
    return null;
  });
  const handleActionChange = (e) => {
    const idx = parseInt(e.target.name.replace('action-', ''));
    const newActions = actions.map((a, i) =>
      i === idx ? parseInt(e.target.value) : a
    );
    setActions([...newActions]);
  };
  const ActionDropdown = ({ i }) => {
    return (
      <select
        name={`action-${i}`}
        value={actions[i]}
        onChange={handleActionChange}
      >
        <option value={0}>NONE SELECTED</option>
        {actionsListArr.map((a, idx) => (
          <option value={idx} key={`action-option-${i}-${idx}`}>
            {a}
          </option>
        ))}
      </select>
    );
  };
  const getConditionString = () => {
    let conditionsArr = defaultConditions.map(
      (_c, idx) => conditionVals[idx] * 20 + conditions[idx]
    );
    return JSON.stringify(conditionsArr);
  };
  const getActionString = () => {
    const actionsArr = [];
    actionsArr[0] = actions[0] * 150 + actions[1];
    actionsArr[1] = actions[2] * 150 + actions[3];
    return JSON.stringify(actionsArr);
  };
  const handleConditionValChange = (e) => {
    const idx = parseInt(e.target.name.replace('conditionVal-', ''));
    const numVal = !isNaN(e.target.value) ? parseInt(e.target.value) : 0;
    const newConditionVals = conditionVals.map((v, i) =>
      i === idx ? numVal : v
    );
    setConditionVals([...newConditionVals]);
  };
  const handleSaveNumInputChange = (e) => {
    setSaveNumInput(e.target.value);
  };
  const handleFixGameSave = () => {
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
  const handleReverseConditions = () => {
    reverseConditions(inputReverseConditions, setConditions, setConditionVals);
  };
  const handleReverseActions = () => {
    reverseActions(inputReverseActions, setActions);
  };
  return (
    <div className="devTools">
      <div className="row">
        <div className="col-6 left">
          <label>Player Input (VERB NOUN):</label>
          <input
            onChange={handleInputChange}
            onKeyDown={handleUserInputKeydown}
            value={inputBuffer}
          />
        </div>
        <div className="col-6 right">
          <label>Vocab ID:</label>
          <div>
            {vocabId} <button onClick={handleInputCheck}>CHECK</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6 left splitCell">
          <label>Conditions:</label>
          {defaultConditions.map((_c, idx) => (
            <div className="conditionsRow" key={`conditions--${idx}`}>
              <ConditionDropDown i={idx} />
              <input
                placeholder="VALUE"
                name={`conditionVal-${idx}`}
                value={conditionVals[idx]}
                onChange={handleConditionValChange}
              />
            </div>
          ))}
        </div>
        <div className="col-6 right">
          <label>Condition Result:</label>
          <div>{getConditionString()}</div>
        </div>
      </div>
      <div className="row">
        <div className="col-6 left">
          <label>Actions:</label>
          {defaultActions.map((_c, idx) => (
            <div className="actionsRow" key={`actions--${idx}`}>
              <ActionDropdown i={idx} />
            </div>
          ))}
        </div>
        <div className="col-6 right">
          <label>Action Result:</label>
          <div>Final: {getActionString()}</div>
          <div>Raw Actions: {JSON.stringify(actions)}</div>
        </div>
      </div>
      <div className="row">
        <div className="col-6 left">
          <label>Lookup Items</label>
          <select name="items-lookup">
            {gameData.items.map((i, idx) => (
              <option key={idx}>{`${i.name} (${idx})`}</option>
            ))}
          </select>
        </div>
        <div className="col-6 right">
          <label>Fix Dev Game Save</label>
          <input
            value={saveNumInput}
            onChange={handleSaveNumInputChange}
            style={{ width: '20%', display: 'inline', marginRight: 10 }}
          />
          <button onClick={handleFixGameSave}>FIX</button>
        </div>
      </div>
      <div className="row">
        <div className="col-6 left splitÇellRev">
          <label>Reverse Conditions</label>
          <input
            value={inputReverseConditions}
            onChange={(e) => setInputReverseConditions(e.target.value)}
          />
          <button onClick={handleReverseConditions}>REVERSE</button>
        </div>
        <div className="col-6 right splitÇellRev">
          <label>Reverse Actions</label>
          <input
            value={inputReverseActions}
            onChange={(e) => setInputReverseActions(e.target.value)}
          />
          <button onClick={handleReverseActions}>REVERSE</button>
        </div>
      </div>
    </div>
  );
};

DevTools.propTypes = {
  gameData: PropTypes.objectOf(PropTypes.any),
};

export default DevTools;
