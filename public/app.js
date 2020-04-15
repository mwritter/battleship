/*
*Just for testing toggle between attack board and fleet board
*You'll have to update the syle.css board-toggle{ display: block }
*to see the button.
*/
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