import game from "./dummy_db.js"


/*
*Just for testing toggle between attack board and fleet board
*You'll have to update the syle.css board-toggle{ display: block }
*to see the button.
*/
const ROWS = "abcdefghij".split("");
let placingBoat = false;
const boardToggle = document.getElementById('board-toggle');
boardToggle.addEventListener('click', () => {
    const fleetBoard = document.getElementById('fleet-board-and-info');
    const attackBoard = document.getElementById('attack-board-and-info');
    const isFleetBoard = window.getComputedStyle(fleetBoard).display === 'grid';
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
})

const boats = document.getElementsByClassName('boat');
for(let boat of boats) {
    boat.addEventListener('click', () => {
        if (placingBoat){
            return;
        }
        placingBoat = true;
        let length = +boat.dataset.value
        let start
        let currentRow = 'a'
        let startRow = currentRow
        let endRow = currentRow
        let startColumn = 1,
        endColumn = startColumn + length - 1
        let points = []
        let pos = 'h'
        const drawFleet = (currentBoats) => {
            for(let currentBoat of currentBoats){
                for(let point of currentBoat){
                    document.querySelector(`[data-value=${point.point}]`).classList = point.classList
                }
            }
        }
        const placeBoatH = (row) => {
            let currentBoats = game.player1.fleet
            currentRow = row
            points = []
            for(let i = 0; i < length; i++){
                let point = document.querySelector(`[data-value=${row + (+startColumn + i)}`)
                points.push(point)
                point.classList.add('h-occupied');
                if (!start) {
                    start = point;
                    point.classList.add('h-front-end')
                    continue
                } else if (i == length - 1) {
                    point.classList.add('h-back-end')
                    endColumn = +point.dataset.value.split('').slice(1).join('')
                    continue
                } else {
                    point.classList.add('h-occupied')
                    continue
                }
            }
            drawFleet(currentBoats)
            start = undefined
        }
        const placeBoatV = () => {
            let currentBoats = game.player1.fleet
            let rows = ROWS.slice(ROWS.indexOf(startRow), ROWS.indexOf(endRow) + 1)
            points = []
            for(let i = 0; i < length; i++){
                let point = document.querySelector(`[data-value=${rows[i] + startColumn}`)
                points.push(point)
                point.classList.add('v-occupied');
                if (!start) {
                    start = point;
                    startRow = point.dataset.value.split('')[0]
                    point.classList.add('v-front-end')
                    continue
                } else if (i == length - 1) {
                    point.classList.add('v-back-end')
                    endRow = point.dataset.value.split('')[0]
                    continue
                } else {
                    point.classList.add('v-occupied')
                    continue
                }
            }
            start = undefined
            drawFleet(currentBoats)
        }
        placeBoatH(currentRow)
        boat.remove()
        const checkPointsLeftRight = (num) => {
            let placeIsGood = false;
            let occupied = game.player1.fleet.map(point => point.point)
            let currentPoints = points.map(point => point.dataset.value)
            let nextPoints = currentPoints.map(point => {
                let row = point.split("")[0]
                let column = parseInt(point.split("").slice(1).join(""))
                    return `${row}${column+num}`
                })
            for(let nextPoint of nextPoints){
                if (occupied.includes(nextPoint)){
                    return placeIsGood
                }
            }
            return true
        }

        const checkPointsUpDown = (num) => {
            let placeIsGood = false;
            let occupied = game.player1.fleet.map(point => point.point)
            let currentPoints = points.map(point => point.dataset.value)
            let nextPoints = currentPoints.map(point => {
                let row = point.split("")[0]
                let nextRow = ROWS[ROWS.indexOf(row) + num]
                let column = parseInt(point.split("").slice(1).join(""))
                    return `${nextRow}${column}`
                })
            for(let nextPoint of nextPoints){
                if (occupied.includes(nextPoint)){
                    return placeIsGood
                }
            }
            return true
        }

        document.addEventListener('keydown', _onMoveBoat)
        function _onMoveBoat(e) {
            let length = +boat.dataset.value
            switch(e.keyCode){
                case 40: { //down
                    for(let point of points) {
                        point.classList.remove(pos + '-occupied')
                        point.classList.remove(pos + '-front-end')
                        point.classList.remove(pos + '-back-end')
                    }
                    if (pos == 'v'){
                        endRow = endRow != 'j'
                            ? ROWS[ROWS.indexOf(endRow) + 1]
                            : ROWS[ROWS.indexOf(endRow)]
                        startRow = ROWS[ROWS.indexOf(endRow) - (length - 1)]
                        placeBoatV()
                    } else {
                        let nextIndex = currentRow != 'j'
                            ? ROWS.indexOf(currentRow) + 1
                            : ROWS.indexOf(currentRow)
                        placeBoatH(ROWS[nextIndex])
                    }
                    break;
                }
                case 38: { //up
                    for(let point of points) {
                        point.classList.remove(pos + '-occupied')
                        point.classList.remove(pos + '-front-end')
                        point.classList.remove(pos + '-back-end')
                    }

                    if (pos == 'v'){
                        startRow = startRow != 'a'
                            ? ROWS[ROWS.indexOf(startRow) - 1]
                            : ROWS[ROWS.indexOf(startRow)]
                        endRow = ROWS[ROWS.indexOf(startRow) + (length - 1)]
                        placeBoatV()
                    } else {
                        let nextIndex = currentRow != 'a'
                            ? ROWS.indexOf(currentRow) - 1
                            : ROWS.indexOf(currentRow)
                        placeBoatH(ROWS[nextIndex])
                    }
                    break;
                }
                case 39: { //right
                    if (endColumn == 10){
                        return
                    }
                    for(let point of points) {
                        point.classList.remove(pos + '-occupied')
                        point.classList.remove(pos + '-front-end')
                        point.classList.remove(pos + '-back-end')
                    }
                    
                    startColumn++
                    endColumn++
                    
                    if (pos == 'v'){
                        placeBoatV()
                    } else {
                        placeBoatH(currentRow)
                    }
                    break;
                }
                case 37: { //left
                    if (startColumn == 1){
                        return
                    }
                    for(let point of points) {
                        point.classList.remove(pos + '-occupied')
                        point.classList.remove(pos + '-front-end')
                        point.classList.remove(pos + '-back-end')
                    }
                    
                    startColumn--
                    endColumn--
                    if (pos == 'v'){
                        placeBoatV()
                    } else {
                        placeBoatH(currentRow)
                    }
                    break;
                }
                case 32: { //spacebar
                    for(let point of points) {
                        point.classList.remove(pos + '-occupied')
                        point.classList.remove(pos + '-front-end')
                        point.classList.remove(pos + '-back-end')
                    }
                    pos = pos == 'v' ? 'h' : 'v'
                    
                    if (pos == 'v'){
                        let center = Math.ceil(length / 2)
                        endColumn = startColumn = points[center - 1].dataset.value.split("")[1]
                        startRow = 'a'
                        endRow = ROWS[ROWS.indexOf(startRow) + (length - 1)]
                        placeBoatV()
                    } else {
                        startColumn = 1
                        placeBoatH(currentRow)
                    }
                    break;
                }

                case 13: {
                    const pointArray = points.map(point => {
                        return {
                            point: point.dataset.value,
                            classList: point.classList.value
                        }
                    })
                    let found = false
                    for(let currentBoat of game.player1.fleet){
                        for(let point of currentBoat){
                            const newPoint = pointArray.find(p => p.point == point.point)
                            if (newPoint){
                                found = true
                                break
                            }
                        }
                    }
                    if (!found){
                        game.player1.fleet.push(pointArray)
                        placingBoat = false
                        document.removeEventListener('keydown', _onMoveBoat)
                    } else {
                        alert('Move your boat!')
                    }
                }
            }
        }
    })

}