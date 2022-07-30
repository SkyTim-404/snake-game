class Position {
    constructor(x = 0, y = 0) {
        this.x = x; // from 0 to gridSize
        this.y = y; // from 0 to gridSize
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    assign(other) {
        this.x = other.x;
        this.y = other.y;
    }

    setRandomly(properties) {
        this.x = floor(random(0, properties.gridSize));
        this.y = floor(random(0, properties.gridSize));
    }

    distance(other) {
        return abs(this.x - other.x) + abs(this.y - other.y);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    in(other) {
        for (let position of other) {
            if (this.equals(position)) return true;
        }
        return false;
    }
}
