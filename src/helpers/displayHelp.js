const displayHelp = (updateStdOutput) => {
  const output = `> ?
HELP:
- Use simple sentences in VERB NOUN format such as "GO NORTH" and "TAKE TORCH."
- Some items can be used only in certain circumstances, and other items may have passive powers that are active when they are in your inventory.
- There is a limit to how much you can carry, so inventory management is critical. DROP items in a central area when not needed.
- Some areas have no obvious directional exits but there are items listed that you can go to such as "GO ELEVATOR" or "GO SHED."
- Some actions will cause things to change. Use LOOK to reassess the area and note new items.
- Type "SAVE GAME" to save your game and "LOAD GAME" to load it. You can also use save slot #s such as "SAVE GAME 1" and "LOAD GAME 1" if you like.
`;
  updateStdOutput(output, 'append');
  return null;
};
export default displayHelp;
