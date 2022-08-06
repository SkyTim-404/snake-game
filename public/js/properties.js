class Properties {
    constructor(canvasSize, boxSize) {
        this.canvasSize = canvasSize;
        this.boxSize = boxSize;
        this.gridSize = this.canvasSize / this.boxSize;
    }
}
