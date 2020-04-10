import { boats } from "./boats.js"

const pieces = document.getElementById('boat-pieces');

for(let boat of boats){
    pieces.innerHTML += boat.html;
}