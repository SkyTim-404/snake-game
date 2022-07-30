class Snake {
    constructor(properties) {
        this.properties = properties;
        this.direction = Direction.RIGHT;
        this.positions = [];
        this.positions.push(new Position(3, 3));
    }

    show() {
        fill(255); // White
        for (let position of this.positions) {
            square(
                position.x * this.properties.boxSize,
                position.y * this.properties.boxSize,
                this.properties.boxSize
            );
        }
        if (this.onFood()) {
            this.eat();
        } else {
            this.move();
        }
    }

    move() {
        for (let i = this.positions.length - 1; i > 0; i--) {
            this.positions[i].assign(this.positions[i - 1]);
        }
        switch (this.direction) {
            case Direction.UP:
                this.positions[0].set(this.positions[0].x, this.positions[0].y - 1);
                break;
            case Direction.DOWN:
                this.positions[0].set(this.positions[0].x, this.positions[0].y + 1);
                break;
            case Direction.LEFT:
                this.positions[0].set(this.positions[0].x - 1, this.positions[0].y);
                break;
            case Direction.RIGHT:
                this.positions[0].set(this.positions[0].x + 1, this.positions[0].y);
                break;
            default:
                break;
        }
    }

    isDead() {
        let outOfBound =
            this.positions[0].x < 0 ||
            this.positions[0].x >= this.properties.gridSize ||
            this.positions[0].y < 0 ||
            this.positions[0].y >= this.properties.gridSize;
        let crashedOnTail = this.positions[0].in(this.positions.slice(1));
        return outOfBound || crashedOnTail;
    }

    onFood() {
        return this.positions[0].equals(board.food.position);
    }

    setDirectionUp() {
        if (this.direction === Direction.DOWN) return;
        this.direction = Direction.UP;
    }

    setDirectionDown() {
        if (this.direction === Direction.UP) return;
        this.direction = Direction.DOWN;
    }

    setDirectionLeft() {
        if (this.direction === Direction.RIGHT) return;
        this.direction = Direction.LEFT;
    }

    setDirectionRight() {
        if (this.direction === Direction.LEFT) return;
        this.direction = Direction.RIGHT;
    }

    eat() {
        switch (this.direction) {
            case Direction.UP:
                this.positions.unshift(
                    new Position(
                        board.food.position.x, board.food.position.y - 1)
                );
                break;
            case Direction.DOWN:
                this.positions.unshift(
                    new Position(
                        board.food.position.x, board.food.position.y + 1)
                );
                break;
            case Direction.LEFT:
                this.positions.unshift(
                    new Position(
                        board.food.position.x - 1, board.food.position.y)
                );
                break;
            case Direction.RIGHT:
                this.positions.unshift(
                    new Position(
                        board.food.position.x + 1, board.food.position.y)
                );
                break;
            default:
                break;
        }
        board.food.reset();
    }

    length() {
        return this.positions.length;
    }

    reset() {
        this.direction = Direction.RIGHT;
        this.positions = [];
        this.positions.push(new Position(3, 3));
    }
}

const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
};

function showSnakePosition() {
    fill(0, 255, 0); // light green
    rect(board.properties.canvasSize, 0, 200, board.properties.canvasSize);
    textSize(45);
    fill(0);
    text("Score: " + board.snake.length(), 610, 50);
    textSize(32);
    fill(220, 0, 200);
    for (let i in board.snake.positions) {
        text(
            i +
            "  [" +
            board.snake.positions[i].x +
            ", " +
            board.snake.positions[i].y +
            "]",
            620,
            100 + i * 30
        );
    }
}
