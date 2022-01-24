const showScore = (gameState, gameData) => {
  let score = 0;
  let maxScore = 0;
  gameData.bitFlagInfo.map((bf, idx) => {
    maxScore += bf.value;
    if (bf.value > 0 && gameState.bitFlags[idx]) {
      score = score + bf.value;
    }
    return null;
  });
  return `Your score: ${score} out of a possible ${maxScore}.\n`;
};

export default showScore;
