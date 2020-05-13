import Player  from "./Player.js";
import Board from "./Board.js";

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

    go(){
        this.gameSetup();
        this.renderBoard();
    }

    gameSetup(){
        // set up boards
        this.player_one.fleetBoard = new Board({ type: "fleet" });
        this.player_two.fleetBoard = new Board({ type: "fleet" });
        return {
            
        }
        
    }

    renderBoard(){
        this.player_one.fleetBoard.render();
        document.getElementById("board-and-info")
            .append(this.player_one.fleetBoard.el)
        document.getElementById("board-and-info")
            .append(this.player_one.fleetBoard.buildGamePieces());
        const boats = document.getElementsByClassName("boat");
        for (let boat of boats) {
            boat.addEventListener("click", () => {
                this.addBoatClickListener(boat);
            });
        }
    }

    //Game Logic - might be board logic
    clearBoard(){
        let points = document.querySelectorAll("#attack-board .point");
        for (let point of points) {
          point.classList.remove("hit");
          point.classList.remove("miss");
          point.classList.add("empty");
        }
    }

    togglePlayer(){
        this.playerInfo.innerHTML = this.nextPlayer.getName();
        let player = this.currentPlayer;
        this.currentPlayer = this.nextPlayer;
        this.nextPlayer = player;
    };

    passTurn(){
        return new Promise(res => {
          let pass = confirm(`Pass to ${this.nextPlayer.getName()}`)
          if (pass) {
            this.togglePlayer();
            res();
          } else {
            this.togglePlayer();
            res();
          }
        })
    }

    toggleAttackBoard(){
        this.clearBoard();
        const plays = this.currentPlayer.attacks;
        for (let play of plays) {
          document
            .querySelector(`#attack-board [data-value="${play.place.dataset.value}"]`)
            .firstChild.classList.replace("empty", play.className);
        }
    };

    takeShot (place){
        let className = "miss";
        for (let points of this.nextPlayer.fleet) {
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
        this.currentPlayer.attacks.push({
          place,
          className,
        });
        this.passTurn().then(() => {
          this.toggleAttackBoard();
        });
    };

    drawFleet(currentBoats) {
        for (let currentBoat of currentBoats) {
            for (let point of currentBoat) {
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

    addShotListener(){
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

    allPiecesSet(player){
        return player.fleet.length == 5;
    }

    removeClasses(){
        for (let point of this.points) {
            point.classList.remove(this.pos + "-occupied");
            point.classList.remove(this.pos + "-front-end");
            point.classList.remove(this.pos + "-back-end");
        }
    }

    addBoatMoveListener(e){
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
              for (let point of currentBoat) {
                const newPoint = pointArray.find((p) => p.point == point.point);
                if (newPoint) {
                  found = true;
                  break;
                }
              }
            }
            if (!found) {
              this.currentPlayer.fleet.push(pointArray);
              this.placingBoat = false;
              document.removeEventListener("keydown", this.boatMoveListener);
              this.pos = "h";
              if (
                this.allPiecesSet(this.currentPlayer) &&
                this.allPiecesSet(this.nextPlayer)
              ) {
                this.nextPlayer.attackBoard = new Board({ type: "attack" });
                this.nextPlayer.attackBoard.render();
                let fleet = document.getElementById("fleet-board");
                fleet.innerHTML = "";
                fleet.style.display = "none";
                let boardAndInfo = document.getElementById("board-and-info")
                boardAndInfo.append(this.nextPlayer.attackBoard.el);
                this.passTurn().then(() => {
                  this.addShotListener();
                });
              } else if (this.allPiecesSet(this.currentPlayer)) {
                document.getElementById("fleet-board").innerHTML = "";
                this.nextPlayer.fleetBoard.render();
                document
                  .getElementById("fleet-board")
                  .replaceWith(this.nextPlayer.fleetBoard.el);
                document.getElementById("board-and-info").append(this.nextPlayer.fleetBoard.buildGamePieces());
                this.passTurn().then(() => {
                  const boats = document.getElementsByClassName("boat");
                  for (let boat of boats) {
                    boat.addEventListener("click", () => {
                      this.addBoatClickListener(boat);
                    });
                  }
                });
              }
            } else {
              alert("Move your boat!");
            }
          }
        }
      };

}