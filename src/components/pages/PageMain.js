import React, { useEffect, useState, useRef } from 'react';
import ReactGA from 'react-ga';
import { fetchGameData, playerTurn } from '@src/helpers';
import {
  SELECTING_GAME,
  PLAYING_GAME,
  defaultShowDevTools,
} from '@src/constants';
import {
  AppHeader,
  MainBg,
  LoadingDisplay,
  SelectGame,
  DevTools,
} from '@src/components';
import { displayHelp } from '../../helpers';
const PageMain = () => {
  const [appStatus, setAppStatus] = useState(SELECTING_GAME);
  const terminalInputRef = useRef(null);
  const soEof = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState('');
  const [gameInitted, setGameInitted] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');
  const [stdOutput, setStdOutput] = useState('Initializing...');
  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [showDevTools, setShowDevTools] = useState(false);

  ReactGA.initialize('UA-118400872-5');
  ReactGA.pageview(window.location.pathname);

  const handleInputChange = (e) => {
    if (appStatus === PLAYING_GAME) {
      setInputBuffer(e.target.value.toUpperCase());
    }
  };
  const handleToggleDevTools = () => {
    setShowDevTools(!showDevTools);
  };
  const resetGame = () => {
    setAppStatus(SELECTING_GAME);
    setStdOutput('');
    setInputBuffer('');
    setGameState(null);
  };
  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (appStatus === PLAYING_GAME) {
      if (!gameState.gameActive || inputBuffer === 'QUIT') {
        resetGame();
        return null;
      }
      if (inputBuffer === '?') {
        displayHelp(updateStdOutput);
      } else {
        playerTurn(
          inputBuffer,
          updateStdOutput,
          { ...gameState },
          gameData,
          setGameState,
          triggerLoadDisplay
        );
      }
      setInputBuffer('');
    }
  };
  const updateStdOutput = (s, mode) => {
    if (mode === 'append') {
      const maxLines = 50;
      const splitStdOutput = stdOutput.split('\n');
      const truncStdOutput = splitStdOutput
        .slice(Math.max(splitStdOutput.length - maxLines, 0))
        .join(String.fromCharCode(10));
      setStdOutput(`${truncStdOutput}${s}`);
    } else {
      setStdOutput(s);
    }
  };
  const handleGameChange = async (selectedGame) => {
    if (selectedGame && selectedGame.slug) {
      ReactGA.event({
        category: 'LOAD_GAME',
        action: selectedGame.slug,
        label: selectedGame.slug,
      });

      triggerLoadDisplay(false, 'loading');
      setGameInitted(false);
      await fetchGameData(selectedGame, setGameData, setGameState);
      setAppStatus(PLAYING_GAME);
      setIsLoading(false);
    }
  };
  const triggerLoadDisplay = (isFake, mode) => {
    document.body.classList.add('isLoading');
    setIsLoading(true);
    setShowLoading(mode);
    if (isFake) {
      setTimeout(() => {
        setIsLoading(false);
      }, 50);
    }
  };
  useEffect(() => {
    if (!isLoading) {
      const loadingTimer = setTimeout(() => {
        setShowLoading('');
        document.body.classList.remove('isLoading');
      }, 500);
      return () => clearTimeout(loadingTimer);
    }
  }, [isLoading]);
  useEffect(() => {
    soEof.current.scrollIntoView();
    terminalInputRef.current.focus();
  }, [stdOutput]);
  useEffect(() => {
    if (gameData && gameState && !gameInitted) {
      playerTurn(
        '',
        updateStdOutput,
        gameState,
        gameData,
        setGameState,
        triggerLoadDisplay
      );
      setGameInitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData, gameState]);
  return (
    <div className="page">
      <MainBg />
      <div className="pageFg">
        <AppHeader
          gameName={gameData?.headers.name}
          numTurns={gameState?.numTurns}
        />
        {appStatus === SELECTING_GAME && (
          <SelectGame setGame={handleGameChange} />
        )}

        <div
          className={`gameWrap ${appStatus === PLAYING_GAME ? 'active' : ''}`}
        >
          <div className="terminalOutputWrap">
            <label>» Terminal Output</label>
            <div className="terminalOutput">
              <div
                className="terminalOutputContent"
                dangerouslySetInnerHTML={{ __html: stdOutput }}
              />
              <div ref={soEof} className="terminalOutputEof">
                EOF
              </div>
            </div>
          </div>
          <div className="terminalInputWrap">
            <label>» Type Your Commands Here</label>
            <form onSubmit={handleInputSubmit}>
              <input
                className="terminalInput"
                name="userInput"
                value={inputBuffer}
                onChange={handleInputChange}
                autoFocus
                autoComplete="off"
                ref={terminalInputRef}
              />
            </form>
          </div>
        </div>
        {defaultShowDevTools && gameData && (
          <div className="devToolsToggle">
            <button onClick={handleToggleDevTools}>[+]</button>
          </div>
        )}
        {gameData && showDevTools && <DevTools gameData={gameData} />}
      </div>
      {showLoading !== '' && <LoadingDisplay mode={showLoading} />}
    </div>
  );
};
export default PageMain;
