import React from 'react';
import { getActionString } from '@src/helpers';
import PropTypes from 'prop-types';

const DevPanelActions = ({ actions, setActions, actionsListArr }) => {
  const defaultActions = [0, 0, 0, 0];
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
  return (
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
        <div>Final: {getActionString(actions)}</div>
        <div>Raw Actions: {JSON.stringify(actions)}</div>
      </div>
    </div>
  );
};

DevPanelActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.any),
  setActions: PropTypes.func.isRequired,
  actionsListArr: PropTypes.arrayOf(PropTypes.any),
};

export default DevPanelActions;
