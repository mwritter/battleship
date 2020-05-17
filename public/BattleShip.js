import Player from "./Player.js";
import Board from "./Board.js";
import Boat from "./Boat.js";

export default class BattleShip {
	constructor(names) {
		this.player_one = new Player(names.playerOne)
		this.player_two = new Player(names.playerTwo)
		this.playerInfo = document.getElementById("player-info")
		this.currentPlayer = this.player_one
		this.nextPlayer = this.player_two
		this.ROWS = "abcdefghij".split("")
		this.placingBoat = false
		this.start = null
		this.currentRow = 'a'
		this.startRow = 'a'
		this.endRow = 'a'
		this.points = []
		this.pos = 'h'
	}

	go() {
		this.gameSetup();
		this.renderBoard();
	}

	gameSetup() {
		// set up boards
		this.player_one.fleetBoard = new Board({ type: "fleet" });
		this.player_two.fleetBoard = new Board({ type: "fleet" });
		return {

		}

	}

	renderBoard() {
		let boardAndInfo = document.getElementById("board-and-info");
		this.player_one.fleetBoard.render();
		this.playerInfo.innerHTML = this.currentPlayer.getName();
		boardAndInfo.append(this.player_one.fleetBoard.buildGameInfo());
		boardAndInfo.append(this.player_one.fleetBoard.el)
		boardAndInfo.append(this.player_one.fleetBoard.buildGamePieces());

		const boats = document.getElementsByClassName("boat");
		for (let boat of boats) {
			boat.addEventListener("click", () => {
				this.addBoatClickListener(boat);
			});
		}
	}

	//Game Logic - might be board logic
	clearBoard() {
		let points = document.querySelectorAll("#attack-board .point");
		for (let point of points) {
			point.classList.remove("hit");
			point.classList.remove("miss");
			point.classList.add("empty");
		}
	}

	togglePlayer() {
		this.playerInfo.innerHTML = this.nextPlayer.getName();
		let player = this.currentPlayer;
		this.currentPlayer = this.nextPlayer;
		this.nextPlayer = player;
	};

	toggleAttackBoard() {
		this.clearBoard();
		const plays = this.currentPlayer.attacks;
		for (let play of plays) {
			document
				.querySelector(`#attack-board [data-value="${play.place.dataset.value}"]`)
				.firstChild.classList.replace("empty", play.className);
		}
	};

	takeShot(place) {
		if (this.currentPlayer.isShooting) {
			return;
		}
		let sunk = false;
		this.currentPlayer.isShooting = true;
		let className = "miss";
		for (let boat of this.nextPlayer.fleet) {
			let found = false;
			className = "miss";
			for (let point of boat.points) {
				if (point.point == place.dataset.value) {
					found = true;
					className = "hit";
					place.firstElementChild.classList.remove("empty");
					place.firstElementChild.classList.remove("miss");
					place.firstElementChild.classList.add(className);
					break;
				} else {
					place.firstElementChild.classList.remove("empty");
					place.firstElementChild.classList.add("miss");
				}
			}
			if (found) {
				break;
			}
		}
		this.currentPlayer.attacks.push({
			place,
			className,
		});
		if (className == 'hit') {
			for (let boat of this.nextPlayer.fleet) {
				if (boat.points.map(point => point.point).includes(place.dataset.value)) {
					boat.hits.push(place.dataset.value);
					sunk = boat.isSunk();
				}
			}
		}

		let msg = sunk
			? `Good job captain! You've sunk ${this.nextPlayer.getName()} boat!`
			: `Thats a ${className.toUpperCase()}!`
		let onClick = () => {
			delete this.currentPlayer.isShooting;
			this.togglePlayer();
			this.toggleAttackBoard();
			let alertBox = document.getElementById('alert-box')
			alertBox.innerHTML = ''
			alertBox.removeEventListener('click', onClick);
			alertBox.style.display = 'none';
		}
		this.alertPlayer({ msg, onClick });
	};

	drawFleet(currentBoats) {
		for (let currentBoat of currentBoats) {
			for (let point of currentBoat.getPoints()) {
				document.querySelector(`[data-value=${point.point}]`).classList =
					point.classList;
			}
		}
	}

	placeBoatH(row) {
		let length = +this.boat.dataset.value;
		let currentBoats = this.currentPlayer.fleet;
		this.currentRow = row;
		this.points = [];
		for (let i = 0; i < length; i++) {
			let point = document.querySelector(
				`[data-value=${row + (+this.startColumn + i)}`
			);
			this.points.push(point);
			point.classList.add("h-occupied");
			if (!this.start) {
				this.start = point;
				point.classList.add("h-front-end");
				continue;
			} else if (i == length - 1) {
				point.classList.add("h-back-end");
				this.endColumn = +point.dataset.value.split("").slice(1).join("");
				continue;
			} else {
				point.classList.add("h-occupied");
				continue;
			}
		}
		this.drawFleet(currentBoats);
		this.start = undefined;
	};

	placeBoatV() {
		let length = +this.boat.dataset.value;
		let currentBoats = this.currentPlayer.fleet;
		let rows = this.ROWS.slice(this.ROWS.indexOf(this.startRow), this.ROWS.indexOf(this.endRow) + 1);
		this.points = [];
		for (let i = 0; i < length; i++) {
			let point = document.querySelector(
				`[data-value=${rows[i] + this.startColumn}`
			);
			this.points.push(point);
			point.classList.add("v-occupied");
			if (!this.start) {
				this.start = point;
				this.tartRow = point.dataset.value.split("")[0];
				point.classList.add("v-front-end");
				continue;
			} else if (i == length - 1) {
				point.classList.add("v-back-end");
				this.endRow = point.dataset.value.split("")[0];
				continue;
			} else {
				point.classList.add("v-occupied");
				continue;
			}
		}
		this.start = undefined;
		this.drawFleet(currentBoats);
	};

	addBoatClickListener(boat) {
		if (this.placingBoat) {
			return;
		}
		let length = +boat.dataset.value;
		this.startColumn = 1;
		this.endColumn = this.startColumn + length - 1;
		this.boat = boat;
		this.placingBoat = true;
		this.placeBoatH("a");
		boat.remove();
		this.boatMoveListener = (e) => {
			this.addBoatMoveListener(e);
		}
		document.addEventListener("keydown", this.boatMoveListener);
	};

	addShotListener() {
		const places = document.getElementsByClassName("place");
		for (let place of places) {
			place.addEventListener("click", (e) => {
				if (!place.firstElementChild.classList.value.includes("empty")) {
					return;
				}
				this.takeShot(place);
			});
		}
	};

	allPiecesSet(player) {
		return player.fleet.length == 5;
	}

	removeClasses() {
		for (let point of this.points) {
			point.classList.remove(this.pos + "-occupied");
			point.classList.remove(this.pos + "-front-end");
			point.classList.remove(this.pos + "-back-end");
		}
	}

	addBoatMoveListener(e) {
		let boat = this.boat;
		let length = +boat.dataset.value;
		switch (e.keyCode) {
			case 40: {
				//down
				this.removeClasses();
				if (this.pos == "v") {
					this.endRow =
						this.endRow != "j"
							? this.ROWS[this.ROWS.indexOf(this.endRow) + 1]
							: this.ROWS[this.ROWS.indexOf(this.endRow)];
					this.startRow = this.ROWS[this.ROWS.indexOf(this.endRow) - (length - 1)];
					this.placeBoatV();
				} else {
					let nextIndex =
						this.currentRow != "j"
							? this.ROWS.indexOf(this.currentRow) + 1
							: this.ROWS.indexOf(this.currentRow);
					this.placeBoatH(this.ROWS[nextIndex]);
				}
				break;
			}
			case 38: {
				//up
				this.removeClasses();
				if (this.pos == "v") {
					this.startRow =
						this.startRow != "a"
							? this.ROWS[this.ROWS.indexOf(this.startRow) - 1]
							: this.ROWS[this.ROWS.indexOf(this.startRow)];
					this.endRow = this.ROWS[this.ROWS.indexOf(this.startRow) + (length - 1)];
					this.placeBoatV();
				} else {
					let nextIndex =
						this.currentRow != "a"
							? this.ROWS.indexOf(this.currentRow) - 1
							: this.ROWS.indexOf(this.currentRow);
					this.placeBoatH(this.ROWS[nextIndex]);
				}
				break;
			}
			case 39: {
				//right
				if (this.endColumn == 10) {
					return;
				}
				this.removeClasses();

				this.startColumn++;
				this.endColumn++;

				if (this.pos == "v") {
					this.placeBoatV();
				} else {
					this.placeBoatH(this.currentRow);
				}
				break;
			}
			case 37: {
				//left
				if (this.startColumn == 1) {
					return;
				}
				this.removeClasses();

				this.startColumn--;
				this.endColumn--;
				if (this.pos == "v") {
					this.placeBoatV();
				} else {
					this.placeBoatH(this.currentRow);
				}
				break;
			}
			case 32: {
				//spacebar
				this.removeClasses();
				this.pos = this.pos == "v" ? "h" : "v";

				if (this.pos == "v") {
					let center = Math.ceil(length / 2);
					this.endColumn = this.startColumn = this.points[
						center - 1
					].dataset.value.split("")[1];
					this.startRow = "a";
					this.endRow = this.ROWS[this.ROWS.indexOf(this.startRow) + (length - 1)];
					this.placeBoatV();
				} else {
					this.startColumn = 1;
					this.placeBoatH(this.currentRow);
				}
				break;
			}

			case 13: {
				//enter
				const pointArray = this.points.map((point) => {
					return {
						point: point.dataset.value,
						classList: point.classList.value,
					};
				});
				let found = false;
				for (let currentBoat of this.currentPlayer.fleet) {
					for (let point of currentBoat.getPoints()) {
						const newPoint = pointArray.find((p) => p.point == point.point);
						if (newPoint) {
							found = true;
							break;
						}
					}
				}
				if (!found) {
					this.currentPlayer.fleet.push(new Boat({ points: pointArray }));
					this.placingBoat = false;
					document.removeEventListener("keydown", this.boatMoveListener);
					this.pos = "h";
					if (
						this.allPiecesSet(this.currentPlayer) &&
						this.allPiecesSet(this.nextPlayer)
					) {
						let alertBox = document.getElementById('alert-box')
						document.getElementById("game-pieces").replaceWith(alertBox);
						let msg =
							`Looks like all boats are set <i class="fas fa-thumbs-up"></i><br/>
								click here then pass to ${this.nextPlayer.getName()}`
						let onClick = () => {
							this.nextPlayer.attackBoard = new Board({ type: "attack" });
							this.nextPlayer.attackBoard.render();
							document.getElementById("fleet-board").replaceWith(this.nextPlayer.attackBoard.el)
							this.togglePlayer();
							this.addShotListener();
							alertBox.innerHTML = ''
							alertBox.removeEventListener('click', onClick);
							alertBox.style.display = 'none';
							let boardSwap = document.getElementById('board-swap');
							boardSwap.style.display = '';
						}
						this.alertPlayer({ msg, onClick });
					} else if (this.allPiecesSet(this.currentPlayer)) {
						let msg =
							`Looks like all boats are set <i class="fas fa-thumbs-up"></i><br/>
								click here then pass to ${this.nextPlayer.getName()}`
						let onClick = () => {
							document.getElementById("fleet-board").innerHTML = "";
							this.nextPlayer.fleetBoard.render();
							document
								.getElementById("fleet-board")
								.replaceWith(this.nextPlayer.fleetBoard.el);
							document.getElementById("game-pieces").replaceWith(this.nextPlayer.fleetBoard.buildGamePieces());
							this.togglePlayer()
							const boats = document.getElementsByClassName("boat");
							for (let boat of boats) {
								boat.addEventListener("click", () => {
									this.addBoatClickListener(boat);
								});
							}
							let alertBox = document.getElementById('alert-box')
							alertBox.innerHTML = ''
							alertBox.removeEventListener('click', onClick);
							alertBox.style.display = 'none';
						}
						this.alertPlayer({ msg, onClick });


					}
				} else {
					const alertBox = document.getElementById('alert-box');
					this.alertPlayer({
						msg: `Your boats are overlapping captain!<br>Move that boat!`,
						onClick: () => {
							console.log('clicked');
							alertBox.style.display = 'none'
							alertBox.innerHTML = ''
							alertBox.removeEventListener('click', this)
						},
						title: 'Click and then move your boat'
					});
				}
			}
		}
	}

	placeAlertBox(pos) {
		const alertBox = document.getElementById('alert-box')
		if (pos === 'center') {
			alertBox.style.gridRows = '2/3';
			alertBox.style.gridColumn = '1/1';
		} else {
			alertBox.style.gridRows = '3/4';
			alertBox.style.gridColumn = '1/1';
		}
	}

	alertPlayer({ msg, onClick, title }) {
		const alertBox = document.getElementById('alert-box');
		alertBox.setAttribute('title', title ? title : 'Click to pass turn');
		if (onClick) {
			alertBox.addEventListener('click', onClick);
		}
		alertBox.style.display = 'flex';
		alertBox.innerHTML = `<h1>${msg}</h1>`
		return alertBox;
	}

}