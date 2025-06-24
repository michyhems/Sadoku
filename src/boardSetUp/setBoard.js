const array = [];
const backtrackingArray = [];
for (let i = 0; i < 9; i++) {
    array.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    backtrackingArray.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

function reset() {
    for (let i = 0; i < 9; i++) {
        array[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        backtrackingArray[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
}

export const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function randomIntArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function checkSegment(origin, value) {
    let x = origin[0];
    let y = origin[1];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (array[x + i][y + j] == value) return false;
        }
    }
    return true;
}

function freeNumbersSegment(origin) {
    let output = [];
    values.forEach((val) => {
        if (checkSegment(origin, val)) output.push(val);
    });
    return output;
}

function fillSegment(origin) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            array[origin[0] + i][origin[1] + j] = randomIntArray(
                freeNumbersSegment(origin)
            );
            if (array[origin[0] + i][origin[1] + j] == undefined) {
                array[origin[0] + i][origin[1] + j] =
                    freeNumbersSegment(origin)[0];
            }
            backtrackingArray[origin[0] + i][origin[1] + j] = -1;
        }
    }
}

function checkXAndY(coordinate, value) {
    for (let i = 0; i < 9; i++) {
        if (array[coordinate[0]][i] == value) return false;
        if (array[i][coordinate[1]] == value) return false;
    }
    return true;
}

export function freeNumbers(origin, coordinate) {
    let output = [];
    values.forEach((val) => {
        if (checkXAndY(coordinate, val) && checkSegment(origin, val))
            output.push(val);
    });
    return output;
}

function fillCell(coordinate) {
    let origin = cellToOrigin(coordinate);
    let arr = freeNumbers(origin, coordinate);
    if (arr.length == 0) {
        return false;
    } else {
        let i = coordinate[0];
        let j = coordinate[1];
        backtrackingArray[i][j] = [1].concat(arr);
        array[i][j] = arr[0];
        return true;
    }
}

export function cellToOrigin(coordinate) {
    let origin = [0, 0];
    if (coordinate[0] >= 6) origin[0] = 6;
    else if (coordinate[0] >= 3) origin[0] = 3;
    if (coordinate[1] >= 6) origin[1] = 6;
    else if (coordinate[1] >= 3) origin[1] = 3;
    return origin;
}

function backTrack(coordinate) {
    let i = coordinate[0];
    let j = coordinate[1];
    while (i != 0 || j != 0) {
        if (j != 0) j--;
        else i--;
        if (backtrackingArray[i][j] == -1) continue;
        if (backtrackingArray[i][j].length == 2) {
            backtrackingArray[i][j] = 0;
            array[i][j] = 0;
            continue;
        }
        backtrackingArray[i][j][0] = backtrackingArray[i][j][0] + 1;
        if (backtrackingArray[i][j][0] < backtrackingArray[i][j].length) {
            let index = backtrackingArray[i][j][0];
            array[i][j] = backtrackingArray[i][j][index];
            break;
        } else {
            array[i][j] = 0;
            backtrackingArray[i][j] = 0;
            continue;
        }
    }
    return i;
}

function populateBoard() {
    fillSegment([0, 0]);
    fillSegment([3, 3]);
    fillSegment([6, 6]);
    let iterations = 0;
    let maxLimit = 50;
    let backtracking = false;
    let i = 0;
    while (i < 9) {
        backtracking = false;
        for (let j = 0; j < 9; j++) {
            if (array[i][j] != 0) continue;
            if (!fillCell([i, j])) {
                iterations++;
                backtracking = true;
                i = backTrack([i, j]);
                break;
            }
        }
        if (!backtracking) {
            i++;
        }
        if (iterations == maxLimit) return false;
    }
    return true;
}

function randomIntInRange(max) {
    return Math.floor(Math.random() * max);
}

export const emptySpaces = [];
function addSpaces(array) {
    let i = 0;
    let j = 0;
    let origin = [
        [0, 0],
        [0, 3],
        [0, 6],
        [3, 0],
        [3, 3],
        [3, 6],
        [6, 0],
        [6, 3],
        [6, 6],
    ];

    for (let k = 0; k < 9; k++) {
        i = randomIntInRange(3) + origin[k][0];
        j = randomIntInRange(3) + origin[k][1];
        array[i][j] = 0;
        emptySpaces.push([i, j]);
        i = randomIntInRange(3) + origin[k][0];
        j = randomIntInRange(3) + origin[k][1];
        array[i][j] = 0;
        emptySpaces.push([i, j]);
    }
}

export function setBoard() {
    for (let i = 0; i < 10; i++) {
        if (populateBoard()) break;
        else reset();
    }
    addSpaces(array);
    return array;
}
