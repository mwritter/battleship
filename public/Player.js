class Player {
  constructor(name) {
    this.name = name;
    this.fleet = [];
    this.attacks = [];
    this.currentBoard = 'fleet';
  }

  getFleet() {
    return this.fleet;
  }

  getAttacks() {
    return this.attacks;
  }

  getName() {
    return this.name;
  }

  getCurrentBoard() {
    return this.currentBoard;
  }
}

export default Player;
