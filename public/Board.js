class Board {
	constructor(options) {
		this.type = options.type;
		this.ROWS = "abcdefghij";
		this.COLUMNS = 10;
		this.showGamePieces = options.withGamePieces || false;
	}

	render() {
		this.el = document.createElement("div");
		this.el.setAttribute("id", `${this.type}-board`);
		this.el.classList.add("board");
		this.buildBoard();
	}

	buildBoard() {
		this.buildGrid();
	}

	buildGrid() {
		let count = 1;
		const rows = this.ROWS.split("");
		for (let row of rows) {
			let row_indicator = document.createElement("p");
			row_indicator.innerHTML = row.toUpperCase();
			this.el.appendChild(row_indicator);
			for (let i = 1; i <= this.COLUMNS; i++) {
				if (count <= this.COLUMNS) {
					let column_indicator = document.createElement("p");
					column_indicator.innerHTML = (this.COLUMNS - count) + 1;
					this.el.prepend(column_indicator);
					count++;
				}
				let place = document.createElement("span");
				place.setAttribute("data-value", `${row + i}`);
				place.classList.add("place");
				let point = document.createElement("span");
				point.classList.add("point");
				point.classList.add("empty");
				place.appendChild(point);
				this.el.appendChild(place);
			}
		}
		let boardSwap = document.createElement("i");
		let place = document.createElement("p");
		boardSwap.classList.add('fas');
		boardSwap.classList.add('fa-sync-alt');
		boardSwap.setAttribute('title', 'View Fleet Board')
		boardSwap.setAttribute('id', 'board-swap')
		boardSwap.style.display = 'none'
		place.append(boardSwap)
		this.el.prepend(place);
		return;
	}

	buildGamePieces() {
		const gamePieces = document.createElement('div');
		gamePieces.setAttribute('id', 'game-pieces')
		const boatSizes = [
			{ class: "five", value: "5" },
			{ class: "four", value: "4" },
			{ class: "three", value: "3" },
			{ class: "three", value: "3" },
			{ class: "two", value: "2" },
		];
		let row_one = document.createElement("div");
		let row_two = document.createElement("div");
		row_one.classList.add("game-pieces-row");
		row_two.classList.add("game-pieces-row");
		for (let boat of boatSizes) {
			let div = document.createElement("div");
			div.classList.add("boat");
			div.classList.add(boat.class);
			div.setAttribute("data-value", boat.value);
			if (boat.value > 3) {
				row_one.append(div);
			} else {
				row_two.append(div);
			}
		}
		gamePieces.append(row_one);
		gamePieces.append(row_two);
		return gamePieces;
	}

	buildGameInfo() {
		const gameInfo = document.createElement('span');
		gameInfo.setAttribute('id', 'game-info');
		let shots = ['hit', 'miss']
		for (let info of shots) {
			let place = document.createElement('span');
			let point = document.createElement('span');
			let p = document.createElement('p');
			place.classList.add('place');
			point.classList.add('point');
			point.classList.add(info);
			place.append(point);
			p.innerHTML = info.toUpperCase();
			gameInfo.append(place);
			gameInfo.append(p);
		}
		return gameInfo;
	}

}

export default Board;
