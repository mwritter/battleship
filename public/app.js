import game from "./dummy_db.js";
import Board from "./Board.js";

/*
 *Just for testing toggle between attack board and fleet board
 *You'll have to update the syle.css board-toggle{ display: block }
 *to see the button.
 */
const playerInfo = document.getElementById("player-info");
playerInfo.innerHTML = "Player 1";
const board = new Board({ type: "fleet" });
window.board = board;
const fleetBoard = document.getElementById("fleet-board");
fleetBoard.replaceWith(board.el);

const ROWS = "abcdefghij".split("");
let placingBoat = false;
const boardToggle = document.getElementById("board-toggle");
boardToggle.addEventListener("click", () => {
  const fleetBoard = document.getElementById("fleet-board-and-info");
  const attackBoard = document.getElementById("attack-board-and-info");
  const isFleetBoard = window.getComputedStyle(fleetBoard).display === "grid";
  let text = "View Fleet Board";
  if (!isFleetBoard) {
    text = "View Attack Board";
    attackBoard.style.display = "none";
    fleetBoard.style.display = "grid";
  } else {
    attackBoard.style.display = "grid";
    fleetBoard.style.display = "none";
  }
  boardToggle.innerHTML = text;
});

const boats = document.getElementsByClassName("boat");
let start;
let currentRow = "a";
let startRow = currentRow;
let endRow = currentRow;
let points = [],
  pos = "h";
window.currentPlayer = { name: "Player 1", data: "player1" };
window.nextPlayer = { name: "Player 2", data: "player2" };
const addBoatClickListener = (boat) => {
  let length = +boat.dataset.value;
  window.startColumn = 1;
  window.endColumn = window.startColumn + length - 1;
  window.boat = boat;
  if (placingBoat) {
    return;
  }
  placingBoat = true;

  const drawFleet = (currentBoats) => {
    for (let currentBoat of currentBoats) {
      for (let point of currentBoat) {
        document.querySelector(`[data-value=${point.point}]`).classList =
          point.classList;
      }
    }
  };
  window.placeBoatH = (row) => {
    let currentBoats = game[window.currentPlayer.data].fleet;
    currentRow = row;
    points = [];
    for (let i = 0; i < length; i++) {
      let point = document.querySelector(
        `[data-value=${row + (+window.startColumn + i)}`
      );
      points.push(point);
      point.classList.add("h-occupied");
      if (!start) {
        start = point;
        point.classList.add("h-front-end");
        continue;
      } else if (i == length - 1) {
        point.classList.add("h-back-end");
        window.endColumn = +point.dataset.value.split("").slice(1).join("");
        continue;
      } else {
        point.classList.add("h-occupied");
        continue;
      }
    }
    drawFleet(currentBoats);
    start = undefined;
  };
  window.placeBoatV = () => {
    let currentBoats = game[window.currentPlayer.data].fleet;
    let rows = ROWS.slice(ROWS.indexOf(startRow), ROWS.indexOf(endRow) + 1);
    points = [];
    for (let i = 0; i < length; i++) {
      let point = document.querySelector(
        `[data-value=${rows[i] + window.startColumn}`
      );
      points.push(point);
      point.classList.add("v-occupied");
      if (!start) {
        start = point;
        startRow = point.dataset.value.split("")[0];
        point.classList.add("v-front-end");
        continue;
      } else if (i == length - 1) {
        point.classList.add("v-back-end");
        endRow = point.dataset.value.split("")[0];
        continue;
      } else {
        point.classList.add("v-occupied");
        continue;
      }
    }
    start = undefined;
    drawFleet(currentBoats);
  };
  window.placeBoatH("a");
  boat.remove();
  document.addEventListener("keydown", addBoatMoveListener);
};
const addBoatMoveListener = (e) => {
  let boat = window.boat;
  let length = +boat.dataset.value;
  const allPiecesSet = (player) => {
    return game[player].fleet.length == 5;
  };
  switch (e.keyCode) {
    case 40: {
      //down
      for (let point of points) {
        point.classList.remove(pos + "-occupied");
        point.classList.remove(pos + "-front-end");
        point.classList.remove(pos + "-back-end");
      }
      if (pos == "v") {
        endRow =
          endRow != "j"
            ? ROWS[ROWS.indexOf(endRow) + 1]
            : ROWS[ROWS.indexOf(endRow)];
        startRow = ROWS[ROWS.indexOf(endRow) - (length - 1)];
        window.placeBoatV();
      } else {
        let nextIndex =
          currentRow != "j"
            ? ROWS.indexOf(currentRow) + 1
            : ROWS.indexOf(currentRow);
        window.placeBoatH(ROWS[nextIndex]);
      }
      break;
    }
    case 38: {
      //up
      for (let point of points) {
        point.classList.remove(pos + "-occupied");
        point.classList.remove(pos + "-front-end");
        point.classList.remove(pos + "-back-end");
      }

      if (pos == "v") {
        startRow =
          startRow != "a"
            ? ROWS[ROWS.indexOf(startRow) - 1]
            : ROWS[ROWS.indexOf(startRow)];
        endRow = ROWS[ROWS.indexOf(startRow) + (length - 1)];
        window.placeBoatV();
      } else {
        let nextIndex =
          currentRow != "a"
            ? ROWS.indexOf(currentRow) - 1
            : ROWS.indexOf(currentRow);
        window.placeBoatH(ROWS[nextIndex]);
      }
      break;
    }
    case 39: {
      //right
      if (window.endColumn == 10) {
        return;
      }
      for (let point of points) {
        point.classList.remove(pos + "-occupied");
        point.classList.remove(pos + "-front-end");
        point.classList.remove(pos + "-back-end");
      }

      window.startColumn++;
      window.endColumn++;

      if (pos == "v") {
        window.placeBoatV();
      } else {
        window.placeBoatH(currentRow);
      }
      break;
    }
    case 37: {
      //left
      if (window.startColumn == 1) {
        return;
      }
      for (let point of points) {
        point.classList.remove(pos + "-occupied");
        point.classList.remove(pos + "-front-end");
        point.classList.remove(pos + "-back-end");
      }

      window.startColumn--;
      window.endColumn--;
      if (pos == "v") {
        window.placeBoatV();
      } else {
        window.placeBoatH(currentRow);
      }
      break;
    }
    case 32: {
      //spacebar
      for (let point of points) {
        point.classList.remove(pos + "-occupied");
        point.classList.remove(pos + "-front-end");
        point.classList.remove(pos + "-back-end");
      }
      pos = pos == "v" ? "h" : "v";

      if (pos == "v") {
        let center = Math.ceil(length / 2);
        window.endColumn = window.startColumn = points[
          center - 1
        ].dataset.value.split("")[1];
        startRow = "a";
        endRow = ROWS[ROWS.indexOf(startRow) + (length - 1)];
        window.placeBoatV();
      } else {
        window.startColumn = 1;
        window.placeBoatH(currentRow);
      }
      break;
    }

    case 13: {
      //enter
      const pointArray = points.map((point) => {
        return {
          point: point.dataset.value,
          classList: point.classList.value,
        };
      });
      let found = false;
      for (let currentBoat of game[window.currentPlayer.data].fleet) {
        for (let point of currentBoat) {
          const newPoint = pointArray.find((p) => p.point == point.point);
          if (newPoint) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        game[window.currentPlayer.data].fleet.push(pointArray);
        placingBoat = false;
        document.removeEventListener("keydown", addBoatMoveListener);
        pos = "h";
        if (allPiecesSet("player1") && allPiecesSet("player2")) {
          console.log(game);
        } else if (allPiecesSet(window.currentPlayer.data)) {
          playerInfo.innerHTML = window.nextPlayer.name;
          window.currentPlayer = window.nextPlayer;
          window.nextPlayer = {};
          document.getElementById("fleet-board").innerHTML = "";
          window.board = new Board({ type: "fleet" });
          document.getElementById("fleet-board").replaceWith(window.board.el);
          const boats = document.getElementsByClassName("boat");

          for (let boat of boats) {
            boat.addEventListener("click", () => {
              addBoatClickListener(boat);
            });
          }
        }
      } else {
        alert("Move your boat!");
      }
    }
  }
};
for (let boat of boats) {
  boat.addEventListener("click", () => {
    addBoatClickListener(boat);
  });
}
