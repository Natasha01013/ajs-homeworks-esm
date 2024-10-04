const { Character } = require('./domain.js');
const { Game, GameSavingData, readGameSaving, writeGameSaving } = require('./game.js');

const game = new Game();
game.start();



console.log('Hello')
