import React from 'react';
import { getNounVerbFromInput, getWordsFromInput } from '@src/helpers';
import PropTypes from 'prop-types';

const DevPanelVocab = ({
  inputBuffer,
  setInputBuffer,
  vocabId,
  setVocabId,
  gameData,
}) => {
  const handleInputChange = (e) => {
    setInputBuffer(e.target.value.toUpperCase());
  };
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
  return (
    <div className="row">
      <div className="col-6 left">
        <label>Player Input (VERB NOUN):</label>
        <input
          className="fullInput"
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
  );
};

DevPanelVocab.propTypes = {
  inputBuffer: PropTypes.string,
  setInputBuffer: PropTypes.func.isRequired,
  vocabId: PropTypes.number,
  setVocabId: PropTypes.func.isRequired,
  gameData: PropTypes.objectOf(PropTypes.any),
};
export default DevPanelVocab;
