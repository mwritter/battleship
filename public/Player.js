class Player {
  constructor(name) {
    this.name = name;
    this.fleet = [];
    this.attacks = [];
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
}

export default Player;
