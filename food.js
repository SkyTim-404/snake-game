class Food {
    constructor(properties) {
        this.properties = properties;
        this.position = new Position();
    }

    show() {
        fill("red"); // Red
        square(
            this.position.x * this.properties.boxSize,
            this.position.y * this.properties.boxSize,
            this.properties.boxSize
        );
    }

    reset(snakePositions) {
        this.position.setRandomly(this.properties);
        while (this.position.in(snakePositions)) {
            this.position.setRandomly(this.properties);
        }
    }
}
