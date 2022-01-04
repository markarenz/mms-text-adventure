import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getGamesList } from '@src/helpers';
import { selectGameIntroText } from '@src/constants';

const SelectGame = ({ setGame }) => {
  const selectGameRef = useRef(null);
  const [gamesList, setGamesList] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const addKeys = () => {
    window.addEventListener('keydown', handleKeydown);
  };
  const removeKeys = () => {
    window.removeEventListener('keydown', handleKeydown);
  };
  const updateSelectedIdx = (d) => {
    removeKeys();
    let newIdx = selectedIdx + d;
    const maxIdx = gamesList.length - 1;
    if (newIdx > maxIdx) {
      newIdx = 0;
    }
    if (newIdx < 0) {
      newIdx = maxIdx;
    }
    setSelectedIdx(newIdx);
  };
  const handleKeydown = (e) => {
    if ([39, 40].includes(e.which)) {
      updateSelectedIdx(1);
    } else if ([37, 38].includes(e.which)) {
      updateSelectedIdx(-1);
    } else if (e.which === 13) {
      handleSelectGame(selectedIdx);
    }
  };
  const handleSelectButtonClick = (idx) => {
    handleSelectGame(idx);
  };
  useEffect(() => {
    addKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx, gamesList]);
  const initComponent = () => {
    getGamesList(setGamesList);
    selectGameRef.current.focus();
  };
  const handleSelectGame = (i) => {
    removeKeys();
    setGame(gamesList[i]);
  };
  useEffect(() => {
    initComponent();
  }, []);
  return (
    <div className="selectGame" onKeyUp={handleKeydown} ref={selectGameRef}>
      <div className="explainer">{selectGameIntroText}</div>
      <div className="buttons">
        {gamesList?.map((g, idx) => (
          <button
            key={`selectGame-btn-${idx}`}
            className={`btn ${idx === selectedIdx ? 'selected' : ''}`}
            onClick={() => handleSelectButtonClick(idx)}
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
};
SelectGame.propTypes = {
  setGame: PropTypes.func,
};
export default SelectGame;
