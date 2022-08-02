// controll parameters
let humanPlaying = false;
let speedMultiplier = 3;

// game parameters
const canvasSize = 600;
const boxSize = 20;
const baseSpeed = 3;

// model parameters
const gamma = 0.9;
const learningRate = 0.001;

// global parameters (do not touch)
let showSnakeData = false;
let currentDirection = Direction.RIGHT;
let properties = new Properties(canvasSize, boxSize);
let board;

function setup() {
    createCanvas(canvasSize, canvasSize);
    board = new Board(properties, learningRate, gamma);
}

function draw() {
    background(15); // Black
    controlFrameRate();
    if (showSnakeData) showSnakePosition(board.snake);
    if (humanPlaying) board.snake.setDirection(currentDirection); // player only change snake direction once per frame
    board.show();
    board.update(humanPlaying);
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
            humanPlaying = !humanPlaying;
            break;
        default:
            break;
    }
}

function controlFrameRate() {
    frameRate(baseSpeed * speedMultiplier);
}