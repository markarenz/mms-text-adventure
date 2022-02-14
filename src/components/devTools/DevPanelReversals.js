import React from 'react';
import { reverseConditions, reverseActions } from '@src/helpers';
import PropTypes from 'prop-types';

const DevPanelReversals = ({
  inputReverseConditions,
  setInputReverseConditions,
  inputReverseActions,
  setInputReverseActions,
  setConditions,
  setConditionVals,
  setActions,
}) => {
  const handleReverseConditions = () => {
    reverseConditions(inputReverseConditions, setConditions, setConditionVals);
  };
  const handleReverseActions = () => {
    reverseActions(inputReverseActions, setActions);
  };
  return (
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
  );
};

DevPanelReversals.propTypes = {
  inputReverseConditions: PropTypes.string,
  setInputReverseConditions: PropTypes.func.isRequired,
  inputReverseActions: PropTypes.string,
  setInputReverseActions: PropTypes.func.isRequired,
  setConditions: PropTypes.func.isRequired,
  setConditionVals: PropTypes.func.isRequired,
  setActions: PropTypes.func.isRequired,
};

export default DevPanelReversals;
