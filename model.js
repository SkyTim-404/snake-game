class QNet {
    constructor(learningRate, gamma, inNodes, h1Nodes, h2Nodes, outNodes) {
        this.lr = learningRate;
        this.gamma = gamma;
        this.inNodes = inNodes;
        this.h1Nodes = h1Nodes;
        this.h2Nodes = h2Nodes;
        this.outNodes = outNodes;
        this.M1 = math.multiply(math.subtract(math.matrix(math.random([h1Nodes, inNodes])), 0.5), 2);
        this.b1 = math.zeros(h1Nodes);
        this.M2 = math.multiply(math.subtract(math.matrix(math.random([h2Nodes, h1Nodes])), 0.5), 2);
        this.b2 = math.zeros(h2Nodes);
        this.M3 = math.multiply(math.subtract(math.matrix(math.random([outNodes, h2Nodes])), 0.5), 2);
        this.b3 = math.zeros(outNodes);
        this.relu = new ReLU();
    }

    forward(state) {
        let h1 = this.relu.forward(math.add(math.multiply(this.M1, state), this.b1));
        let h2 = this.relu.forward(math.add(math.multiply(this.M2, h1), this.b2));
        let decisions = math.add(math.multiply(this.M3, h2), this.b3);
        return [state, h1, h2, decisions];
    }

    backward(currStateOutput, nextStateOutput, movement, response) {
        let reward = response[0];
        let gameEnd = response[1];
    }

    save(filename) {
        localStorage.setItem(filename, JSON.stringify(this));
    }

    load(filename) {
        Object.assign(this, JSON.parse(localStorage.getItem(filename)));
    }
}

function saveModel(model, filename) {
    model.save(filename);
}

function loadModel(model, filename) {
    model.load(filename);
}