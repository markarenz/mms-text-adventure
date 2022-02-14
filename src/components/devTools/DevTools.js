import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DevPanelConditions from './DevPanelConditions';
import DevPanelVocab from './DevPanelVocab';
import DevPanelActions from './DevPanelActions';
import DevPanelItemsMisc from './DevPanelItemsMisc';
import DevPanelReversals from './DevPanelReversals';
import { actionsList } from '@src/constants';

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
  const [itemSearch, setItemSearch] = useState('');
  const handleConditionChange = (e) => {
    const idx = parseInt(e.target.name.replace('condition-', ''));
    const newConditions = conditions.map((c, i) =>
      i === idx ? parseInt(e.target.value) : c
    );
    setConditions([...newConditions]);
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
  const handleConditionValChange = (e) => {
    const idx = parseInt(e.target.name.replace('conditionVal-', ''));
    const numVal = !isNaN(e.target.value) ? parseInt(e.target.value) : 0;
    const newConditionVals = conditionVals.map((v, i) =>
      i === idx ? numVal : v
    );
    setConditionVals([...newConditionVals]);
  };

  return (
    <div className="devTools">
      <DevPanelVocab
        inputBuffer={inputBuffer}
        setInputBuffer={setInputBuffer}
        vocabId={vocabId}
        setVocabId={setVocabId}
        gameData={gameData}
      />
      <DevPanelConditions
        conditionVals={conditionVals}
        handleConditionValChange={handleConditionValChange}
        handleConditionChange={handleConditionChange}
        conditions={conditions}
        inputBuffer={inputBuffer}
        vocabId={vocabId}
        actions={actions}
      />
      <DevPanelActions
        actions={actions}
        setActions={setActions}
        actionsListArr={actionsListArr}
      />
      <DevPanelItemsMisc
        itemSearch={itemSearch}
        setItemSearch={setItemSearch}
        gameData={gameData}
        saveNumInput={saveNumInput}
        setSaveNumInput={setSaveNumInput}
      />
      <DevPanelReversals
        inputReverseConditions={inputReverseConditions}
        setInputReverseConditions={setInputReverseConditions}
        inputReverseActions={inputReverseActions}
        setInputReverseActions={setInputReverseActions}
        setConditions={setConditions}
        setConditionVals={setConditionVals}
        setActions={setActions}
      />
    </div>
  );
};

DevTools.propTypes = {
  gameData: PropTypes.objectOf(PropTypes.any),
};

export default DevTools;
