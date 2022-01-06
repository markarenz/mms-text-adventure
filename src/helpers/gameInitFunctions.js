const getGamesList = async (setGamesList) => {
  return await fetch(`/gameData/index.json`)
    .then((r) => r.json())
    .then((data) => {
      console.log('getGamesList', data);
      setGamesList([...data]);
    });
};

const initGame = (thisGame, setGameState) => {
  const rooms = [];
  for (let x = 0; x < thisGame.rooms.length; x++) {
    rooms[x] = { visited: false };
  }
  setGameState({
    bitFlags: [],
    darkFlag: false,
    gameActive: true,
    items: [...thisGame.items],
    numTurns: 0,
    currentCounter: 0,
    swapValue: null,
    currentRoom: thisGame.headers.origin,
    rooms,
  });
};

const fetchGameData = async (selectedGame, setGameData, setGameState) => {
  await fetch(`/gameData/${selectedGame.slug}.json`)
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      data.headers.slug = selectedGame.slug;
      data.headers.name = selectedGame.name;
      setGameData({ ...data });
      initGame(data, setGameState);
    });
};

export { initGame, fetchGameData, getGamesList };
