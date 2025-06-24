import * as setBoard from "./setBoard.js";

export function addSpaces(array) {
    const maxIters = 20;
    let iters = 0;
    let i = 0;
    let j = 0;
    let emptySpaces = [];
    let memory = [];
    let placeHolder;
    for (let k = 0; k < 9; k++) {
        memory.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    while (iters < maxIters) {
        i = randomIntFromInterval(0, 9);
        j = randomIntFromInterval(0, 9);
        emptySpaces.push([i, j]);
        if (array[i][j] != 0) {
            placeHolder = array[i][j];
            array[i][j] = 0;
            if (!isUniqueSolution(array, memory, 0, emptySpaces, 0)) {
                array[i][j] = placeHolder;
                return array;
            }
        }
        iters++;
    }
    return array;
}

function isUniqueSolution(array, memory, i, emptySpaces, numSolutions) {
    for (let j = 0; j < 9; j++) {
        if (array[i][j] == 0) {
            let origin = setBoard.cellToOrigin([i, j]);
            let arr = setBoard.freeNumbers(origin, [i, j]);
            if (array.length != 0) {
                memory[i][j] = arr;
                array[i][j] = arr[0];
            } else {
                let output = remember(array, memory, i, emptySpaces);
                if (output[0] == 1) {
                    if (numSolutions > 1) return false;
                    else return true;
                } else {
                    array = output[0];
                    memory = output[1];
                    i = output[2];
                    return isUniqueSolution(
                        array,
                        memory,
                        i,
                        emptySpaces,
                        numSolutions
                    );
                }
            }
        }
    }
    if (i == 8) {
        if (numSolutions == 1) return false;
        else {
            numSolutions++;
            let output = remember(array, memory, i, emptySpaces);
            if (output[0] == 1) return true;
            array = output[0];
            memory = output[1];
            i = output[2];
            return isUniqueSolution(
                array,
                memory,
                0,
                emptySpaces,
                numSolutions
            );
        }
    } else {
        return isUniqueSolution(array, memory, i++, emptySpaces, numSolutions);
    }
}

function remember(array, memory, i, emptySpaces) {
    for (let k = emptySpaces.length - 1; k >= 0; k--) {
        let row = emptySpaces[k][0];
        let col = emptySpaces[k][1];
        if (array[row][col] == 0) continue;
        if (memory[row][col].length > 1) {
            memory[row][col].shift();
            array[row][col] = memory[0];
            i = row;
            return [array, memory, i, emptySpaces];
        } else {
            if (k == 0) {
                return [1];
            }
            memory[row][col] = 0;
            return remember(array, memory, i, emptySpaces);
        }
    }
    return [];
}

export function addSpaces2(array) {
    const maxIters = 20;
    let iters = 0;
}

function remember2(memory) {
    let i = memory.length - 1;
    while (i >= 0) {
        if (memory[i][3] == memory[i].length - 1) {
            i--;
            continue;
        } else {
            memory[i][3]++;
            return memory.slice(0, i++);
        }
    }
}

function isUniqueSolution2(array, memory, i) {
    for (let j = 0; j < 9; j++) {
        if (array[i][j] == 0) {
            let origin = setBoard.cellToOrigin([i, j]);
            let arr = setBoard.freeNumbers(origin, [i, j]);
            if (arr.length != 0) {
                array[i][j] = arr[0];
                memory.push([i, j, 3].concat(arr));
            } else {
                memory = remember2(memory);
                array[memory[0]][memory[1]] = memory[memory[3]];
                return isUniqueSolution2(array, memory, memory[i]);
            }
        }
    }
    if (i == 8) return array;
    else return isUniqueSolution2(array, memory, i++);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
