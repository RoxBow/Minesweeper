export const randomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const findingNeighbors = (myArray, i, j) => {
  let neighbors = [];
  let rowLimit = myArray.length - 1;
  let columnLimit = myArray[0].length - 1;

  for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
    for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
      if (x !== i || y !== j) {
        neighbors.push(myArray[x][y]);
      }
    }
  }

  return neighbors;
};
