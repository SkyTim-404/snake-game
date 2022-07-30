class Board {
    constructor(properties) {
        this.properties = properties;
        this.snake = new Snake(this.properties);
        this.food = new Food(this.properties, this.snake);
    }

    show() {
        this.food.show();
        this.snake.show();
        if (this.snake.isDead()) {
            this.reset();
        }
    }

    reset() {
        this.snake.reset();
        this.food.reset();
    }
}
