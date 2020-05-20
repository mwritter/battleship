// look into using router
// https://www.freecodecamp.org/news/making-vanilla-js-router-in-javascript/
import Battleship from './games/Battleship/Battleship.js'
let games = document.getElementsByClassName('game-link')
for (let game of games) {
	game.addEventListener('click', () => {
		document.getElementById('game-select').remove();
		const names = {
			playerOne: "Matthew",
			playerTwo: "Player 2"
		}
		const newGame = new Battleship(names);
		newGame.go();
	})
}
