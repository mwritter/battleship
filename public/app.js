import Battleship from './Battleship.js'
const names = {
	playerOne: "PlayerOne",
	playerTwo: "PlayerTwo"
}
const game = new Battleship(names)
game.go();
