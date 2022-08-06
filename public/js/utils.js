class ReLU {
    forward(input) {
        return math.map(input, (x) => (x > 0) ? x : 0);
    }

    backward(input) {
        return math.map(input, (x) => (x > 0) ? 1 : 0);
    }
}

class LeakyReLU {
    constructor(alpha) {
        this.alpha = alpha;
    }

    forward(input) {
        return math.map(input, (x) => (x > 0) ? x : this.alpha * x);
    }

    backward(input) {
        return math.map(input, (x) => (x > 0) ? 1 : this.alpha);
    }
}

function argmax(vector) {
    let max = Number.NEGATIVE_INFINITY;
    let maxIndex = 0;
    for (let x of vector) {
        if (x.value > max) {
            maxIndex = x.index[0];
            max = x.value;
        }
    }
    return maxIndex;
}

function onehot(index, size) {
    vector = new Array(size).fill(0);
    vector[index] = 1;
    vector = math.reshape(math.matrix(vector), [size, 1]);
    return vector;
}

function ascendingArray(size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(i);
    }
    return arr;
}