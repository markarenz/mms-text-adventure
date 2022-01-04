import { CARRIED } from '@src/constants';

const getInventory = (o, gs, gd) => {
  let invOutput = '';
  let numInv = 0;
  for (let j = 0; j < gd.items.length; j++) {
    const item = gs.items[j];
    console.log(item);
    if (item.loc === CARRIED) {
      invOutput = `${invOutput}${numInv > 0 ? ', ' : ''}${
        item.article !== '' ? `${item.article} ` : ''
      }${item.desc}`;
      numInv = numInv + 1;
    }
  }
  if (numInv > 1) {
    const invOutputArr = invOutput.split(', ');
    const invOutputLastItem = invOutputArr.pop();
    const invOutputFront = invOutputArr.join(', ');
    console.log(invOutputFront, invOutputArr);
    invOutput = `${invOutputFront} and ${invOutputLastItem}`;
  }

  return `${o}I am carrying${
    invOutput === '' ? ' nothing.' : `: ${invOutput}.`
  }\n\n`;
};

const getInventoryCount = (g, numItems) => {
  let invCount = 0;
  for (let x = 0; x < numItems; x++) {
    if (g.items[x].loc === CARRIED) {
      invCount = invCount + 1;
    }
  }
  return invCount;
};

export { getInventory, getInventoryCount };
