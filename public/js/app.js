import BattleShip from './BattleShip.js';

const names = {
	playerOne: 'Player1',
	playerTwo: 'Player2'
}
const game = new BattleShip(names);
game.go();

