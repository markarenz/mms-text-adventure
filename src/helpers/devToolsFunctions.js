const reverseConditions = (
  inputReverseConditions,
  setConditions,
  setConditionVals
) => {
  try {
    const revCondArr = JSON.parse(inputReverseConditions);
    const condArr = [];
    const condValsArr = [];
    revCondArr.map((cx) => {
      const dv = Math.floor(cx / 20);
      const cv = cx % 20;
      condArr.push(cv);
      condValsArr.push(dv);
      return null;
    });
    setConditions([...condArr]);
    setConditionVals([...condValsArr]);
  } catch (err) {
    console.log(err);
  }
};

const reverseActions = (inputReverseActions, setActions) => {
  try {
    const actionArr = JSON.parse(inputReverseActions);
    const act = [];
    act[0] = Math.floor(actionArr[0] / 150);
    act[1] = Math.floor(actionArr[0] % 150);
    act[2] = Math.floor(actionArr[1] / 150);
    act[3] = Math.floor(actionArr[1] % 150);
    setActions([...act]);
  } catch (err) {
    console.log(err);
  }
};

export { reverseConditions, reverseActions };
