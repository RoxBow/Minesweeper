export const randomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const findingNeighbors = (array, i, j) => {
  let neighbors = [];
  let rowLimit = array.length - 1;
  let columnLimit = array[0].length - 1;

  for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
    for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
      if (x !== i || y !== j) {
        neighbors.push(array[x][y]);
      }
    }
  }

  return neighbors;
};

export const findAdjacents = (array, i, y) => {
  let adjacents = [];

  if(array[i - 1] && array[i - 1][y])
    adjacents.push(array[i - 1][y]);

  if(array[i + 1] && array[i + 1][y])
    adjacents.push(array[i + 1][y]);

  if(array[i][y + 1])
    adjacents.push(array[i][y + 1]);

  if(array[i][y - 1])
    adjacents.push(array[i][y - 1]);

  return adjacents;
};
