const showScore = (gameState, gameData) => {
  let score = 0;
  gameData.bitFlagInfo.map((bf, idx) => {
    console.log('SCORE CHECK', bf, gameState.bitFlags[idx]);
    if (bf.value > 0 && gameState.bitFlags[idx]) {
      score = score + bf.value;
    }
    return null;
  });
  return `Current score: ${score} out of a possible ${gameData.headers.maxScore}.`;
};

export default showScore;
