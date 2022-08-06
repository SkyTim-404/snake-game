const Reward = {
    EAT: 10,
    DEATH: -10,
    LOOP: -2,
}

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
        let diff = Q - newQ;
        let dW3 = math.multiply(math.multiply(onehot(movement, this.outNodes), [currStateOutput[2]]), diff);
        let db3 = math.squeeze(math.multiply(onehot(movement, this.outNodes), diff));
        if (!gameEnd) {
            dW3 = math.subtract(dW3, math.multiply(math.multiply(onehot(nextMovement, this.outNodes), [nextStateOutput[2]]), this.gamma*diff));
            db3 = math.subtract(db3, math.multiply(math.squeeze(onehot(nextMovement, this.outNodes)), this.gamma*diff));
        }
        let temp1 = math.multiply(math.squeeze(math.subset(this.W3, math.index(movement, ascendingArray(this.h2Nodes)))), diff);
        let temp2 = math.multiply(math.squeeze(math.subset(this.W3, math.index(nextMovement, ascendingArray(this.h2Nodes)))), diff*this.gamma);
        let dW2 = math.multiply(math.reshape(math.dotMultiply(temp1, this.relu.backward(currStateOutput[2])), [this.h2Nodes, 1]), [currStateOutput[1]]);
        let db2 = math.dotMultiply(temp1, this.relu.backward(currStateOutput[2]));
        if (!gameEnd) {
            dW2 = math.subtract(dW2, math.multiply(math.reshape(math.dotMultiply(temp2, this.relu.backward(nextStateOutput[2])), [this.h2Nodes, 1]), [nextStateOutput[1]]));
            db2 = math.subtract(db2, math.dotMultiply(temp2, this.relu.backward(nextStateOutput[2])));
        }
        temp1 = math.multiply(math.transpose(this.W2), temp1);
        temp2 = math.multiply(math.transpose(this.W2), temp2);
        let dW1 = math.multiply(math.reshape(math.dotMultiply(temp1, this.relu.backward(currStateOutput[1])), [this.h1Nodes, 1]), [currStateOutput[0]]);
        let db1 = math.dotMultiply(temp1, this.relu.backward(currStateOutput[1]));
        if (!gameEnd) {
            dW1 = math.subtract(dW1, math.multiply(math.reshape(math.dotMultiply(temp2, this.relu.backward(nextStateOutput[1])), [this.h1Nodes, 1]), [nextStateOutput[0]]));
            db1 = math.subtract(db1, math.dotMultiply(temp2, this.relu.backward(nextStateOutput[1])));
        }
        this.W3 = math.subtract(this.W3, math.multiply(dW3, this.lr));
        this.b3 = math.subtract(this.b3, math.multiply(db3, this.lr));
        this.W2 = math.subtract(this.W2, math.multiply(dW2, this.lr));
        this.b2 = math.subtract(this.b2, math.multiply(db2, this.lr));
        this.W1 = math.subtract(this.W1, math.multiply(dW1, this.lr));
        this.b1 = math.subtract(this.b1, math.multiply(db1, this.lr));
    }

    save(filename) {
        saveJSON(this, filename);
    }

    load(filename) {
        
    }
}

function saveModel(model, filename) {
    model.save(filename);
}

function loadModel(filename) {

}