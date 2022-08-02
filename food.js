class Food {
    constructor(properties, position) {
        this.properties = properties;
        this.position = position;
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
    }
}
