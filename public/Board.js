class Board {
  constructor(options) {
    this.type = options.type;
    this.ROWS = "abcdefghij";
    this.COLUMNS = 10;
    this.render();
  }

  render() {
    this.el = document.createElement("div");
    this.el.setAttribute("id", `${this.type}-board`);
    this.el.classList.add("board");
    this.buildBoard();
  }

  buildBoard() {
    this.buildGrid();
    this.buildGamePieces();
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
          column_indicator.innerHTML = this.COLUMNS - count;
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
    this.el.prepend(document.createElement("p"));
    return;
  }

  buildGamePieces() {
    const gamePeces = document.getElementById("game-pieces");
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
    gamePeces.append(row_one);
    gamePeces.append(row_two);
  }
}

export default Board;
