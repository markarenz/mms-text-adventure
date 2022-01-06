const displayHelp = (updateStdOutput) => {
  const output = `> ?
HELP:
- As you may have noticed, this is first person, meaning that I am running around in this world doing what you say. So, try not to get me hurt or killed. Please.
- Use simple sentences in VERB NOUN format to tell me what to do such as "GO NORTH" and "TAKE TORCH."
- Some items can be used only in certain circumstances, and other items may have passive powers that are active when they are in your inventory.
- My pockets are finite, so there is a limit to how much I can carry. Thus, inventory management is critical. DROP items in a central area when not needed.
- Some areas have no obvious directional exits but there are items listed that I can go to such as "GO ELEVATOR" or "GO SHED."
- Some actions will cause things to change. Use LOOK to receive a description of the area and note new items.
- Type "SAVE GAME" to save the game and "LOAD GAME" to load it. You can also use save slot #s such as "SAVE GAME 1" and "LOAD GAME 1."
- If you want to select another game, use "QUIT."
`;
  updateStdOutput(output, 'append');
  return null;
};
export default displayHelp;
