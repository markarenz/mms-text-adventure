const noComprendeMessages = [
  "I have no idea what you're talking about.",
  'Try something in VERB NOUN format: TAKE KEY or PEEL GRAPE.',
  'What?',
  'Huh? You may need to use simple words I understand.',
  'Is your cat walking on the keyboard again?',
  'What is it you want me to do? The words you use confuse me.',
];
const takeErrorMsg = `It is beyond my power to do that.\n`;
const exitLabels = ['', 'North', 'South', 'East', 'West', 'Up', 'Down'];
const selectGameIntroText = `BEEP. BOOP. BEEP. This reverse-engineered adventure likes "VERB NOUN" combinations such as "GO NORTH" and "LIGHT TORCH."
During the game, type ? for more help. Select an adventure from the list below.`;
const SELECTING_GAME = 0;
const PLAYING_GAME = 1;
const CARRIED = 999;
const conditionsList = [
  'ADD PARAM', // 0
  'ITEM CARRIED', // 1
  'ITEM IN CURRENT ROOM', // 2
  'ITEM CARRIED OR IN ROOM', // 3
  'PLAYER IN ROOM #', // 4
  'ITEM NOT CARRIED', // 5
  'ITEM NOT IN ROOM OR CARRIED', // 6
  'PLAYER NOT IN ROOM #', // 7
  'BITFLAG IS SET', // 8
  'BITFLAG IS NOT SET', // 9
  'SOMETHING IS CARRIED', // 10
  'NOTHING IS CARRIED', // 11
  'ITEM NOT IN ROOM OR CARRIED - DEPRICATED (?)(?)', // 12
  'ITEM IN GAME', // 13
  'ITEM NOT IN GAME', // 14
  'TURN NUMBER LESS THAN OR EQUAL', // 15
  'TURN NUMBER GREATER THAN OR EQUAL', // 16
  'ITEM IN ORIGINAL ROOM', // 17
  'ITEM NOT IN ORIGINAL ROOM', // 18
  'TURN NUMBER EQUALS', // 19
];
const actionsList = {
  52: 'GET ITEM X IF CAN CARRY',
  53: 'DROP ITEM X',
  54: 'MOVE PLAYER TO ROOM X',
  55: 'REMOVE ITEM X FROM GAME',
  56: 'SET DARK FLAG',
  57: 'UNSET DARK FLAG',
  58: 'SET BITFLAG X',
  60: 'CLEAR BITFLAG X',
  61: 'DEATH',
  62: 'PUT ITEM X IN ROOM Y',
  63: 'GAME OVER, MAN',
  64: 'REDRAW ROOM',
  67: 'SET BITFLAG 0',
  68: 'CLEAR BITFLAG 0',
  69: 'REFILL LAMP',
  70: 'CLEAR SCREEN',
  72: 'SWAP ITEM LOCATIONS FOR X AND Y',
  74: 'TAKE ITEM X EVEN IF ALREADY IN INVENTORY',
  75: 'PUT ITEM X WITH Y (?)',
  76: 'LOOK',
  77: 'DECREMENT COUNTER',
  78: 'DISPLAY COUNTER',
  79: 'SET COUNTER VALUE',
  82: 'ADD X TO COUNTER',
  83: 'SUBTRACT X FROM COUNTER',
  84: 'DISPLAY NOUN WITHOUT LINEFEED',
  85: 'DISPLAY NOUN WITH LINEFEED',
  86: 'LINEFEED',
  90: 'STOP ALL ACTIONS',
};
const defaultShowDevTools = true;
export {
  selectGameIntroText,
  noComprendeMessages,
  exitLabels,
  takeErrorMsg,
  CARRIED,
  SELECTING_GAME,
  PLAYING_GAME,
  conditionsList,
  actionsList,
  defaultShowDevTools,
};
