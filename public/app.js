// look into using router
// https://www.freecodecamp.org/news/making-vanilla-js-router-in-javascript/

let games = document.getElementsByClassName('game-link')
let self = this;
for (let game of games) {
	game.addEventListener('click', () => {
		import(`./games/${game.dataset.value}/${game.dataset.value}.js`)
			.then((mod) => {
				document.getElementById('game-select').remove();
				const names = {
					playerOne: "Matthew",
					playerTwo: "Player 2"
				}
				const game = new mod.default(names);
				game.go();
			})
	})
}
