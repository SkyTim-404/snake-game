const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
};

const Movement = {
    STRAIGHT: 0,
    LEFT: 1,
    RIGHT: 2,
}

class Snake {
    constructor(properties, position) {
        this.properties = properties;
        this.startPosition = position;
    }

    head() {
        return this.positions[0];
    }

    show() {
        fill(255); // White
        for (let position of this.positions) {
            square(position.x * this.properties.boxSize, position.y * this.properties.boxSize, this.properties.boxSize);
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

    setDirection(direction) {
        switch (direction) {
            case Direction.UP:
                this.setDirectionUp();
                break;
            case Direction.DOWN:
                this.setDirectionDown();
                break;
            case Direction.LEFT:
                this.setDirectionLeft();
                break;
            case Direction.RIGHT:
                this.setDirectionRight();
                break;
            default:
                break;
        }
    }

    setDirectionWithMovement(movement) {
        switch (movement) {
            case Movement.LEFT:
                this.turnLeft();
                break;
            case Movement.RIGHT:
                this.turnRight();
                break;
            default:
                break;
        }
    }
    
    turnLeft() {
        switch (this.direction) {
            case Direction.UP:
                this.direction = Direction.LEFT;
                break;
            case Direction.DOWN:
                this.direction = Direction.RIGHT;
                break;
            case Direction.LEFT:
                this.direction = Direction.DOWN;
                break;
            case Direction.RIGHT:
                this.direction = Direction.UP;
                break;
            default:
                break;
        }
    }

    turnRight() {
        switch (this.direction) {
            case Direction.UP:
                this.direction = Direction.RIGHT;
                break;
            case Direction.DOWN:
                this.direction = Direction.LEFT;
                break;
            case Direction.LEFT:
                this.direction = Direction.UP;
                break;
            case Direction.RIGHT:
                this.direction = Direction.DOWN;
                break;
            default:
                break;
        }
    }

    frontIsDangerous() {
        let position;
        switch (this.direction) {
            case Direction.UP:
                position = new Position(this.head().x, this.head().y-1);
                break;
            case Direction.DOWN:
                position = new Position(this.head().x, this.head().y+1);
                break;
            case Direction.LEFT:
                position = new Position(this.head().x-1, this.head().y);
                break;
            case Direction.RIGHT:
                position = new Position(this.head().x+1, this.head().y);
                break;
            default:
                break;
        }
        return position.isOutOfBound(this.properties) || position.in(this.positions);
    }

    leftIsDangerous() {
        let position;
        switch (this.direction) {
            case Direction.UP:
                position = new Position(this.head().x-1, this.head().y);
                break;
            case Direction.DOWN:
                position = new Position(this.head().x+1, this.head().y);
                break;
            case Direction.LEFT:
                position = new Position(this.head().x, this.head().y+1);
                break;
            case Direction.RIGHT:
                position = new Position(this.head().x, this.head().y-1);
                break;
            default:
                break;
        }
        return position.isOutOfBound(this.properties) || position.in(this.positions);
    }

    rightIsDangerous() {
        let position;
        switch (this.direction) {
            case Direction.UP:
                position = new Position(this.head().x+1, this.head().y);
                break;
            case Direction.DOWN:
                position = new Position(this.head().x-1, this.head().y);
                break;
            case Direction.LEFT:
                position = new Position(this.head().x, this.head().y-1);
                break;
            case Direction.RIGHT:
                position = new Position(this.head().x, this.head().y+1);
                break;
            default:
                break;
        }
        return position.isOutOfBound(this.properties) || position.in(this.positions);
    }

    isDead() {
        let outOfBound = this.head().isOutOfBound(this.properties);
        let crashedOnTail = this.head().in(this.positions.slice(1));
        return outOfBound || crashedOnTail;
    }

    onFood(food) {
        return this.positions[0].equals(food.position);
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

    eat(food) {
        switch (this.direction) {
            case Direction.UP:
                this.positions.unshift(new Position(food.position.x, food.position.y - 1));
                break;
            case Direction.DOWN:
                this.positions.unshift(new Position(food.position.x, food.position.y + 1));
                break;
            case Direction.LEFT:
                this.positions.unshift(new Position(food.position.x - 1, food.position.y));
                break;
            case Direction.RIGHT:
                this.positions.unshift(new Position(food.position.x + 1, food.position.y));
                break;
            default:
                break;
        }
    }

    length() {
        return this.positions.length;
    }

    reset() {
        this.direction = Direction.RIGHT;
        this.positions = [];
        this.positions.push(new Position(this.startPosition.x, this.startPosition.y));
    }
}

function showSnakePosition(snake) {
    fill(0, 255, 0); // light green
    rect(snake.properties.canvasSize, 0, 200, snake.properties.canvasSize);
    textSize(45);
    fill(0);
    text("Score: " + snake.length(), 610, 50);
    textSize(32);
    fill(220, 0, 200);
    for (let i in snake.positions) {
        text(
            i +
            "  [" +
            snake.positions[i].x +
            ", " +
            snake.positions[i].y +
            "]",
            620,
            100 + i * 30
        );
    }
}
