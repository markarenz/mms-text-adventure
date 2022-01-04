const initGameSelection = (gamesList, updateStdOutput) => {
  let output = `BEEP. BOOP. BEEP.
  This reverse-engineered adventure likes "VERB NOUN" combinations such as "GO NORTH" and "LIGHT TORCH." During the game, type ? for more help.
  SELECT an adventure to load. Enter the number and hit the ENTER key.
    `;
  gamesList.map((g, idx) => {
    output = `${output}\n${idx + 1}: ${g.name}`;
    return null;
  });
  // updateStdOutput(output, 'clear');
};

const gameSelectionInput = (
  s,
  gamesList,
  handleGameChange,
  updateStdOutput
) => {
  const gameNum = parseInt(s);
  const maxNum = gamesList.length;
  const validSelection = gameNum > 0 && gameNum <= maxNum;
  if (validSelection) {
    updateStdOutput('Loading...', 'clear');
    handleGameChange(gameNum - 1);
  } else {
    updateStdOutput(
      `\n> ${s}\nWhat? Enter a number between 1 and ${maxNum}`,
      'append'
    );
  }
};

export { initGameSelection, gameSelectionInput };
