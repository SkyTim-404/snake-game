class Board {
    constructor(properties, learningRate, gamma) {
        this.properties = properties;
        this.snakeStartPosition = new Position(3, 3);
        this.snake = new Snake(this.properties, this.snakeStartPosition);
        this.food = new Food(this.properties);
        this.model = new QNet(learningRate, gamma, 11, 8, 8, 3);
        this.reset();
    }

    show() {
        this.food.show();
        this.snake.show();
    }

    update(humanPlaying) {
        if (humanPlaying) {
            this.moveSnake();
            return;
        }
        let currStateOutput = this.model.forward(this.getState());
        let movement = argmax(currStateOutput[3]);
        this.snake.setDirectionWithMovement(movement);
        let response = this.moveSnake();
        let nextStateOutput = this.model.forward(this.getState());
        this.checkTimeLimit();
    }

    moveSnake() {
        let reward = 0;
        let gameEnd = false;
        if (this.snake.onFood(this.food)) {
            reward = 10;
            this.snake.eat(this.food);
            this.food.reset(this.snake.positions);
        }
        else {
            this.snake.move();
        }
        if (this.snake.isDead()) {
            reward = -10;
            gameEnd = true;
            this.reset();
        }
        return [reward, gameEnd];
    }

    checkTimeLimit() {
        this.timeLimit += 1;
        if (this.timeLimit > 100*this.snake.length()) {
            this.reset();
        }
    }

    reset() {
        this.timeLimit = 0;
        this.snake.reset();
        this.food.reset(this.snake.positions);
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
