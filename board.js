class Board {
    constructor(properties) {
        this.properties = properties;
        this.snakeStartPosition = new Position(3, 3);
        this.foodStartPosition = new Position(20, 20);
        this.snake = new Snake(this.properties, this.snakeStartPosition);
        this.food = new Food(this.properties, this.foodStartPosition);
        this.model = new QNet(11, 8, 8, 3);
        this.timeController = 0;
    }

    show() {
        this.food.show();
        this.snake.show();
    }

    update() {
        this.timeController += 1;
        let output = this.model.forward(this.getState())
        let movement = argmax(output);
        switch (movement) {
            case Movement.LEFT:
                this.snake.turnLeft();
                break;
            case Movement.RIGHT:
                this.snake.turnRight();
                break;
            default:
                break;
        }
        if (this.snake.onFood(this.food)) {
            this.snake.eat(this.food);
            this.food.reset();
        }
        else {
            this.snake.move();
        }
        this.checkReset();
    }

    checkReset() {
        if (this.snake.isDead() || this.timeController >= 200) {
            this.reset();
        }
    }

    reset() {
        this.snake.reset();
        this.food.reset();
        while (this.food.position.in(this.snake.positions)) {
            this.food.position.setRandomly(this.properties);
        }
        this.timeController = 0;
    }

    getState() {
        let state = new Array(11).fill(-1);
        // snake direction
        if (this.snake.direction == Direction.UP) state[0] = 1;
        if (this.snake.direction == Direction.DOWN) state[1] = 1;
        if (this.snake.direction == Direction.LEFT) state[2] = 1;
        if (this.snake.direction == Direction.RIGHT) state[3] = 1;
        // food position
        if (this.food.position.y < this.snake.head().y) state[4] = 1;
        if (this.food.position.y > this.snake.head().y) state[5] = 1;
        if (this.food.position.x < this.snake.head().x) state[6] = 1;
        if (this.food.position.x > this.snake.head().x) state[7] = 1;
        // danger
        if (this.snake.frontIsDangerous()) state[8] = 1;
        if (this.snake.leftIsDangerous()) state[9] = 1;
        if (this.snake.rightIsDangerous()) state[10] = 1;
        return state;
    }
}
