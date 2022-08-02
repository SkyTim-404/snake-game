class QNet {
    constructor(learningRate, gamma, inNodes, h1Nodes, h2Nodes, outNodes) {
        this.lr = learningRate;
        this.gamma = gamma;
        this.inNodes = inNodes;
        this.h1Nodes = h1Nodes;
        this.h2Nodes = h2Nodes;
        this.outNodes = outNodes;
        this.W1 = math.multiply(math.subtract(math.matrix(math.random([h1Nodes, inNodes])), 0.5), 2);
        this.b1 = math.zeros(h1Nodes);
        this.W2 = math.multiply(math.subtract(math.matrix(math.random([h2Nodes, h1Nodes])), 0.5), 2);
        this.b2 = math.zeros(h2Nodes);
        this.W3 = math.multiply(math.subtract(math.matrix(math.random([outNodes, h2Nodes])), 0.5), 2);
        this.b3 = math.zeros(outNodes);
        this.relu = new ReLU();
    }

    forward(state) {
        let h1 = this.relu.forward(math.add(math.multiply(this.W1, state), this.b1));
        let h2 = this.relu.forward(math.add(math.multiply(this.W2, h1), this.b2));
        let decisions = math.add(math.multiply(this.W3, h2), this.b3);
        return [state, h1, h2, decisions];
    }

    backward(currStateOutput, nextStateOutput, movement, response) {
        let reward = response[0];
        let gameEnd = response[1];
        let Q = currStateOutput[3].subset(math.index(movement));
        let nextMovement = argmax(nextStateOutput[3]);
        let newQ = reward;
        if (!gameEnd) {
            newQ += this.gamma * nextStateOutput[3].subset(math.index(nextMovement));
        }
        let update3 = Q - newQ;
        let dW3 = update3;
        let db3 = update3;
        let update2 = 0;
        let dW2 = 0;
        let db2 = 0;
        let update1 = 0;
        let dW1 = 0;
        let db1 = 0;
        this.W3 = math.subtract(this.W3, math.multiply(dW3, this.lr));
        this.b3 = math.subtract(this.b3, math.multiply(db3, this.lr));
        this.W2 = math.subtract(this.W2, math.multiply(dW2, this.lr));
        this.b2 = math.subtract(this.b2, math.multiply(db2, this.lr));
        this.W1 = math.subtract(this.W1, math.multiply(dW1, this.lr));
        this.b1 = math.subtract(this.b1, math.multiply(db3, this.lr));
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