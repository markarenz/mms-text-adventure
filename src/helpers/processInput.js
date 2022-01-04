const getNounVerbFromInput = (s) => {
  const inputWords = s.split(' ');
  let verb = '';
  let noun = '';
  if (inputWords.length > 1) {
    verb = inputWords[0].substr(0, 3);
    noun = inputWords[1].substr(0, 3);
  } else {
    verb = inputWords[0].substr(0, 3);
    noun = verb;
  }
  return {
    noun,
    verb,
  };
};

const getWordsFromInput = (verb, noun, gameData) => {
  let vc, nc;
  for (let x = 0; x < gameData.verbs.length; x++) {
    let tmpNouns =
      gameData.nouns[x].charAt(0) === '*'
        ? gameData.nouns[x].substr(1, 3)
        : gameData.nouns[x].substr(0, 3);
    let tmpVerbs =
      gameData.verbs[x].charAt(0) === '*'
        ? gameData.verbs[x].substr(1, 3)
        : gameData.verbs[x].substr(0, 3);
    if (tmpNouns === noun) {
      nc = x;
      while (gameData.nouns[nc].charAt(0) === '*') {
        nc = nc - 1;
      }
    }
    if (tmpVerbs === verb) {
      vc = x;
      while (gameData.verbs[vc].charAt(0) === '*') {
        vc = vc - 1;
      }
    }
  }
  return {
    vc,
    nc,
  };
};

export { getNounVerbFromInput, getWordsFromInput };
