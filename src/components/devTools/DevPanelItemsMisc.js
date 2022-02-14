import React from 'react';
import { checkUsage, fixGameSave } from '@src/helpers';
import PropTypes from 'prop-types';

const DevPanelItemsMisc = ({
  itemSearch,
  setItemSearch,
  gameData,
  saveNumInput,
  setSaveNumInput,
}) => {
  const handleSaveNumInputChange = (e) => {
    setSaveNumInput(e.target.value);
  };
  const handleItemSearchChange = (e) => {
    setItemSearch(e.target.value);
  };
  const filteredItems = gameData.items.filter((i) =>
    i.name.toLowerCase().includes(itemSearch.toLowerCase())
  );
  const handleCheckUsage = () => {
    checkUsage(gameData);
  };
  const handleFixGameSave = () => {
    fixGameSave(saveNumInput, gameData);
  };
  return (
    <div className="row">
      <div className="col-6 left">
        <label>Lookup Items</label>
        <input
          placeholder="search"
          className="fullInput mb-1"
          value={itemSearch}
          onChange={handleItemSearchChange}
        />
        <select name="items-lookup">
          {filteredItems.map((i, idx) => (
            <option key={idx}>{`${i.name} (${i.id})`}</option>
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
        <div style={{ marginTop: 10 }}>
          <button onClick={handleCheckUsage}>Check Message/Flag Usage</button>
        </div>
      </div>
    </div>
  );
};

DevPanelItemsMisc.propTypes = {
  itemSearch: PropTypes.string,
  setItemSearch: PropTypes.func.isRequired,
  gameData: PropTypes.objectOf(PropTypes.any),
  saveNumInput: PropTypes.string,
  setSaveNumInput: PropTypes.func,
};

export default DevPanelItemsMisc;
