// hyper parameters
let canvasSize = 600;
let boxSize = 20;
let speedMultiplier = 2;
let debugModeOn = true;

// global parameters
let properties = new Properties(canvasSize, boxSize);
let board;

function setup() {
    board = new Board(properties);
    createCanvas(canvasSize, canvasSize);
}

function draw() {
    background(15); // Black
    if (debugModeOn) showSnakePosition();
    controlFrameRate();
    board.show();
}

function keyPressed() {
    switch (keyCode) {
        // controll snake
        case UP_ARROW:
            board.snake.setDirectionUp();
            break;
        case DOWN_ARROW:
            board.snake.setDirectionDown();
            break;
        case LEFT_ARROW:
            board.snake.setDirectionLeft();
            break;
        case RIGHT_ARROW:
            board.snake.setDirectionRight();
            break;
        // controll game
        case 49: // Key: 1
            if (speedMultiplier > 1) speedMultiplier--;
            break;
        case 50: // Key: 2
            if (speedMultiplier < 10) speedMultiplier++;
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
    frameRate(5 * speedMultiplier);
}
