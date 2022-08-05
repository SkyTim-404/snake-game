class Board {
    constructor(properties, learningRate, gamma) {
        this.properties = properties;
        this.snakeStartPosition = new Position(7, 7);
        this.snake = new Snake(this.properties, this.snakeStartPosition);
        this.food = new Food(this.properties);
        this.model = new QNet(learningRate, gamma, 12, 16, 16, 3);
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
        this.model.backward(currStateOutput, nextStateOutput, movement, response);
        this.checkTimeLimit();
    }

    moveSnake() {
        let reward = 0;
        let gameEnd = false;
        if (this.snake.onFood(this.food)) {
            reward = Reward.EAT;
            this.snake.eat(this.food);
            this.food.reset(this.snake.positions);
            this.timer = 0;
        }
        else {
            reward = -this.timer/this.timeLimit();
            this.snake.move();
        }
        if (this.snake.isDead() || this.checkTimeLimit()) {
            reward = Reward.DEATH;
            gameEnd = true;
            this.reset();
        }
        return [reward, gameEnd];
    }

    timeLimit() {
        return 100 * this.snake.length();
    }

    checkTimeLimit() {
        this.timer += 1;
        return this.timer > this.timeLimit();
    }

    reset() {
        this.timer = 0;
        this.snake.reset();
        this.food.reset(this.snake.positions);
    }

    getState() {
        let state = [];
        // snake direction
        state.push(this.snake.direction === Direction.UP | 0);
        state.push(this.snake.direction === Direction.DOWN | 0);
        state.push(this.snake.direction === Direction.LEFT | 0);
        state.push(this.snake.direction === Direction.RIGHT | 0);
        // food position
        state.push(this.food.position.y < this.snake.head().y | 0);
        state.push(this.food.position.y > this.snake.head().y | 0);
        state.push(this.food.position.x < this.snake.head().x | 0);
        state.push(this.food.position.x > this.snake.head().x | 0);
        // danger
        state.push(this.snake.frontIsDangerous() | 0);
        state.push(this.snake.leftIsDangerous() | 0);
        state.push(this.snake.rightIsDangerous() | 0);
        // time
        state.push(this.timer/this.timeLimit());
        return state;
    }
}
