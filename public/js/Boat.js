class Boat {

    constructor(options) {
        this.points = options.points
        this.hits = []
    }

    getPoints() {
        return this.points
    }

    addHit(point) {
        this.hits.push(point)
    }

    isSunk() {
        return this.hits.length == this.points.length
    }

}


export default Boat;