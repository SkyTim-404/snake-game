// controll parameters
let humanPlaying = false;
let speedMultiplier = 3;

// game parameters
const canvasSize = 600;
const boxSize = 20;
const detailBoardSize = 300;
const baseSpeed = 3;

// filename
const modelDataFilename = "model-data.json";
const gameDataFilename = "game-data.json";

// global parameters (do not touch)
let showSnakeData = false;
let showBoard = true;
let currentDirection = Direction.RIGHT;
let properties = new Properties(canvasSize, boxSize);
let started = false;
let board;

async function setup() {
    createCanvas(canvasSize+detailBoardSize, canvasSize);
    button = createButton("Delete Model Data");
    button.position(canvasSize+detailBoardSize/3, canvasSize*9/10);
    button.size(100, 50);
    button.mousePressed(() => {
        board.deleteData();
    });
    board = new Board(properties, gameDataFilename, modelDataFilename);
    try {
        await board.loadData();
    }
    catch (error) {
        board.saveData();
    }
    started = true;
}

function draw() {
    if (!started) return;
    background(15); // Black
    fill(0, 255, 0); // light green
    rect(canvasSize, 0, detailBoardSize, canvasSize);
    fill(255);
    text(""+speedMultiplier, 850, 30);
    controlFrameRate();
    if (showSnakeData) board.showSnakeDetails();
    else board.showGameScore();
    if (humanPlaying) board.snake.setDirection(currentDirection); // player only change snake direction once per frame
    if (showBoard) board.show();
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
            showSnakeData = !showSnakeData;
            break;
        case 80: // Key: p
            humanPlaying = !humanPlaying;
            break;
        case 83: // Key: s
            showBoard = !showBoard;
            break;
        default:
            break;
    }
}

function controlFrameRate() {
    frameRate(baseSpeed * speedMultiplier);
}
