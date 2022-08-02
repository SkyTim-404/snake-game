// hyper parameters
let humanPlaying = false;
let canvasSize = 600;
let boxSize = 20;
let speedMultiplier = 3;
let debugModeOn = true;

// global parameters
let currentDirection = Direction.RIGHT;
let properties = new Properties(canvasSize, boxSize);
let board;

function setup() {
    board = new Board(properties);
    // board.model.save("model");
    // board.model.load("model");
    // console.log(board.model.forward(board.getState()));
    // console.log(board.getState());
    createCanvas(canvasSize, canvasSize);
}

function draw() {
    background(15); // Black
    if (debugModeOn) showSnakePosition(board.snake);
    controlFrameRate();
    if (humanPlaying) board.snake.updateDirection(currentDirection);
    board.show();
    board.update();
}

function keyPressed() {
    switch (keyCode) {
        // controll snake
        case UP_ARROW:
            currentDirection = Direction.UP;
            break;
        case DOWN_ARROW:
            currentDirection = Direction.DOWN;
            break;
        case LEFT_ARROW:
            currentDirection = Direction.LEFT;
            break;
        case RIGHT_ARROW:
            currentDirection = Direction.RIGHT;
            break;
        // controll game
        case 49: // Key: 1
            if (speedMultiplier > 1) speedMultiplier--;
            break;
        case 50: // Key: 2
            speedMultiplier++;
            break;
        case 48: // Key: 0
            if (debugModeOn) resizeCanvas(canvasSize, canvasSize);
            else resizeCanvas(canvasSize + 200, canvasSize)
            debugModeOn = !debugModeOn;
            break;
        case 80: // Key: p
            speedMultiplier = -speedMultiplier;
            break;
        default:
            break;
    }
}

function controlFrameRate() {
    frameRate(3 * speedMultiplier);
}