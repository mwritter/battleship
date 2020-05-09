import Board from "./Board.js";
import Player from "./Player.js";

/*
 *Just for testing toggle between attack board and fleet board
 *You'll have to update the syle.css board-toggle{ display: block }
 *to see the button.
 */
const playerInfo = document.getElementById("player-info");
const Player_One = new Player("Player 1");
const Player_Two = new Player("Player 2");
playerInfo.innerHTML = Player_One.getName();
Player_One.fleetBoard = new Board({ type: "fleet"});
Player_Two.fleetBoard = new Board({ type: "fleet"});
Player_One.fleetBoard.render();
const boardDisplay = document.getElementById("board-and-info");
boardDisplay.append(Player_One.fleetBoard.el);
boardDisplay.append(Player_One.fleetBoard.buildGamePieces());

const ROWS = "abcdefghij".split("");
let placingBoat = false;
const boats = document.getElementsByClassName("boat");
let start;
let currentRow = "a";
let startRow = currentRow;
let endRow = currentRow;
let points = [],
  pos = "h";
window.currentPlayer = Player_One;
window.nextPlayer = Player_Two;

const togglePlayer = () => {
  playerInfo.innerHTML = window.nextPlayer.name;
  let player = window.currentPlayer;
  window.currentPlayer = window.nextPlayer;
  window.nextPlayer = player;
};

const clearBoard = () => {
  const points = document.querySelectorAll("#attack-board .point");
  for (let point of points) {
    point.classList.remove("hit");
    point.classList.remove("miss");
    point.classList.add("empty");
  }
};

const toggleAttackBoard = () => {
  clearBoard();
  const plays = window.currentPlayer.attacks;
  for (let play of plays) {
    document
      .querySelector(`#attack-board [data-value="${play.place.dataset.value}"]`)
      .firstChild.classList.replace("empty", play.className);
  }
};

const takeShot = (place) => {
  let className = "miss";
  for (let points of window.nextPlayer.fleet) {
    let found = false;
    className = "miss";
    for (let point of points) {
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
  window.currentPlayer.attacks.push({
    place,
    className,
  });
  togglePlayer();
  toggleAttackBoard();
};

const addShotListener = () => {
  const places = document.getElementsByClassName("place");
  for (let place of places) {
    place.addEventListener("click", (e) => {
      if (!place.firstElementChild.classList.value.includes("empty")) {
        return;
      }
      takeShot(place);
    });
  }
};

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
    let currentBoats = window.currentPlayer.fleet;
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
    let currentBoats = window.currentPlayer.fleet;
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
    return player.fleet.length == 5;
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
      for (let currentBoat of window.currentPlayer.fleet) {
        for (let point of currentBoat) {
          const newPoint = pointArray.find((p) => p.point == point.point);
          if (newPoint) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        window.currentPlayer.fleet.push(pointArray);
        placingBoat = false;
        document.removeEventListener("keydown", addBoatMoveListener);
        pos = "h";
        if (
          allPiecesSet(window.currentPlayer) &&
          allPiecesSet(window.nextPlayer)
        ) {
          document.getElementById("info").style.display = "none";
          window.nextPlayer.attackBoard = new Board({ type: "attack" });
          window.nextPlayer.attackBoard.render();
          let fleet = document.getElementById("fleet-board");
          fleet.innerHTML = "";
          fleet.style.display = "none";
          document
            .getElementById("fleet-board-and-info")
            .append(window.nextPlayer.attackBoard.el);
          togglePlayer();
          addShotListener();
        } else if (allPiecesSet(window.currentPlayer)) {
          document.getElementById("fleet-board").innerHTML = "";
          window.nextPlayer.fleetBoard.render();
          document
            .getElementById("fleet-board")
            .replaceWith(window.nextPlayer.fleetBoard.el);
          document.getElementById("board-and-info").append(window.nextPlayer.fleetBoard.buildGamePieces());
          togglePlayer();
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
