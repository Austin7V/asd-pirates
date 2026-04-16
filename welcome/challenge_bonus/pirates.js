const ROWS = 50;
const COLS = 50;

function createEmptyGrid() {
  const newGrid = [];

  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];

    for (let col = 0; col < COLS; col++) {
      currentRow.push(false);
    }

    newGrid.push(currentRow);
  }

  return newGrid;
}

const grid = createEmptyGrid();
grid[10][10] = true;
grid[10][11] = true;
grid[10][12] = true;

function countLiveNeighbors(grid, row, col) {
  let liveNeighbors = 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const neighborRow = row + rowOffset;
      const neighborCol = col + colOffset;

      if (
        neighborRow >= 0 &&
        neighborRow < ROWS &&
        neighborCol >= 0 &&
        neighborCol < COLS
      ) {
        if (grid[neighborRow][neighborCol] === true) {
          liveNeighbors++;
        }
      }
    }
  }

  return liveNeighbors;
}

function getNextGeneration(grid) {
  const nextGrid = createEmptyGrid();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const isAlive = grid[row][col];
      const liveNeighbors = countLiveNeighbors(grid, row, col);

      if (isAlive === true) {
        if (liveNeighbors < 2) {
          nextGrid[row][col] = false;
        } else if (liveNeighbors === 2 || liveNeighbors === 3) {
          nextGrid[row][col] = true;
        } else {
          nextGrid[row][col] = false;
        }
      } else {
        if (liveNeighbors === 3) {
          nextGrid[row][col] = true;
        } else {
          nextGrid[row][col] = false;
        }
      }
    }
  }

  return nextGrid;
}

function renderGrid(grid, generation) {
  console.log(`Generation: ${generation}`);

  for (let row = 0; row < ROWS; row++) {
    let line = "";

    for (let col = 0; col < COLS; col++) {
      line += grid[row][col] ? "#" : ".";
    }

    console.log(line);
  }
}

function clearScreen() {
  console.clear();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  let currentGrid = grid;
  let generation = 0;

  while (true) {
    clearScreen();
    renderGrid(currentGrid, generation);

    await sleep(300);

    currentGrid = getNextGeneration(currentGrid);
    generation++;
  }
}

run();
