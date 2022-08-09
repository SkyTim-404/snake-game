class Board {
    constructor(properties, gameDataFilename, modelDataFilename) {
        this.properties = properties;
        this.gameDataFilename = gameDataFilename;
        this.modelDataFilename = modelDataFilename;
        let snakeStartPosition = new Position(7, 7);
        let snakeStartLength = 3;
        this.snake = new Snake(this.properties, snakeStartPosition, snakeStartLength);
        this.food = new Food(this.properties);
        this.model = new QNet(11, 16, 16, 3);
        this.maxScore = 0;
        this.numOfGames = 0;
        this.reset();
    }

    show() {
        this.food.show();
        this.snake.show();
    }

    update(humanPlaying) {
        if (humanPlaying) {
            this.moveSnake();
        }
        else {
            let currStateOutput = this.model.forward(this.getState());
            let movement = argmax(currStateOutput[3]);
            this.snake.setDirectionWithMovement(movement);
            this.updatePastMovements(movement);
            let response = this.moveSnake();
            let nextStateOutput = this.model.forward(this.getState());
            this.model.backward(currStateOutput, nextStateOutput, movement, response);
        }
        if (this.getScore() > this.maxScore) {
            this.maxScore = this.getScore();
            this.saveData();
        }
    }

    updatePastMovements(movement) {
        this.pastMovements.push(movement);
        if (this.pastMovements.length > 4) this.pastMovements.shift();
    }

    checkPastMovementsEquals() {
        if (this.pastMovements.length < 4) return false;
        if (this.pastMovements[0] === Movement.STRAIGHT) return false;
        let isEqual = true;
        for (let i = 0; i < this.pastMovements.length-1; i++) {
            isEqual = isEqual && (this.pastMovements[i] === this.pastMovements[i+1]);
        }
        return isEqual;
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
            reward = this.checkPastMovementsEquals() ? Reward.LOOP : Reward.LOOP * this.timer/this.timeLimit();
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
        this.numOfGames += 1;
        this.pastMovements = [];
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
        return state;
    }

    getScore() {
        return this.snake.length() - this.snake.startLength;
    }

    showSnakeDetails() {
        textSize(36);
        fill(0);
        text("Length: " + this.snake.length(), 610, 50);
        textSize(32);
        fill(100, 0, 200);
        for (let i in this.snake.positions) {
            text(
                i +
                "  [" +
                this.snake.positions[i].x +
                ", " +
                this.snake.positions[i].y +
                "]",
                620,
                100 + i * 30
            );
        }
    }

    showGameScore() {
        textSize(36);
        fill(0);
        text("Score: " + this.getScore(), 610, 50);
        text("Max Score: " + this.maxScore, 610, 100);
        text("No. of Games: \n" + this.numOfGames, 610, 150);
    }

    saveData() {
        this.saveGameData(this.gameDataFilename);
        this.model.save(this.modelDataFilename);
    }

    async loadData() {
        await this.loadGameData(this.gameDataFilename);
        await this.model.load(this.modelDataFilename);
    }

    deleteData() {
        let del = true;
        fetch(window.location.href + "delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                delete: del
            })
        })
        .catch(err => console.log("error: " + err));
        this.model = new QNet(11, 16, 16, 3);
        this.maxScore = 0;
        this.numOfGames = 0;
        this.reset();
    }

    saveGameData(filename) {
        let data = {
            maxScore: this.maxScore,
            numOfGames: this.numOfGames,
            filename: filename
        };
        fetch(window.location.href + "game-data", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .catch(err => console.log("error: " + err));
    }

    async loadGameData(filename) {
        let res = await fetch(window.location.href + "game-data?" + new URLSearchParams({
            filename: filename
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let data = await res.json();
        for (let property in data) {
            this[property] = data[property];
        }
    }
}
