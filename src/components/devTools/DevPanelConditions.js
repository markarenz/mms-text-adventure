import React from 'react';
import PropTypes from 'prop-types';
import { conditionsList } from '@src/constants';
import { getActionString } from '@src/helpers';
const DevPanelConditions = ({
  conditionVals,
  handleConditionValChange,
  handleConditionChange,
  conditions,
  inputBuffer,
  vocabId,
  actions,
}) => {
  const getConditionString = () => {
    let conditionsArr = defaultConditions.map(
      (_c, idx) => conditionVals[idx] * 20 + conditions[idx]
    );
    return JSON.stringify(conditionsArr);
  };
  const getFullVocab = () => `\t\t\t"//": "${inputBuffer}",
    \t\t\t"matches": [${vocabId}],
    \t\t\t"conditions": ${getConditionString()},
    \t\t\t"actions": ${getActionString(actions)}`;
  const defaultConditions = [0, 0, 0, 0, 0, 0, 0];
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
  return (
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
        <textarea className="fullVocabBox" value={getFullVocab()} readOnly />
      </div>
    </div>
  );
};

DevPanelConditions.propTypes = {
  conditionVals: PropTypes.arrayOf(PropTypes.any),
  handleConditionValChange: PropTypes.func.isRequired,
  handleConditionChange: PropTypes.func.isRequired,
  conditions: PropTypes.arrayOf(PropTypes.any),
  inputBuffer: PropTypes.string,
  vocabId: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.any),
};

export default DevPanelConditions;
