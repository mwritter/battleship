import BattleShip from "./BattleShip.js"

const names = {
  playerOne: "Matthew",
  playerTwo: "Player 2"
}

const game = new BattleShip(names);
game.go();
