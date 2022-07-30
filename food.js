class Food {
    constructor(properties, snake) {
        this.properties = properties;
        this.position = new Position();
        this.position.setRandomly(this.properties);
        while (this.position.equals(snake.positions)) {
            this.position.setRandomly(this.properties);
        }
    }

    show() {
        fill("red"); // Red
        square(
            this.position.x * this.properties.boxSize,
            this.position.y * this.properties.boxSize,
            this.properties.boxSize
        );
    }

    reset() {
        this.position.setRandomly(this.properties);
        while (this.position.in(board.snake.positions)) {
            this.position.setRandomly(this.properties);
        }
    }
}
