import React, { useEffect, useReducer } from 'react';
import './Grid.scss';
import Cell from '../Cell/Cell';
import { TYPE_CELL } from '../../constants';
import { randomNumber, findingNeighbors } from '../../helpers';

type GridProps = {
  isDebugging: Boolean,
  size: Number,
  mine: Number
};

const initState = {
  grid: []
};

const increaseValue = (grid, cell, randomBomb) => {
  const { x, y } = cell;

  const matchBomb = randomBomb.filter(
    ({ x: bombX, y: bombY }) =>
      (x - 1 === bombX && bombY >= y - 1 && bombY <= y + 1) ||
      (x + 1 === bombX && bombY >= y - 1 && bombY <= y + 1) ||
      (y - 1 === bombY && bombX === x) ||
      (y + 1 === bombY && bombX === x)
  );

  return matchBomb.length;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return { grid: action.grid };
    default:
      throw new Error();
  }
};

const discover = (cell, grid, dispatch) => {
  grid[cell.x][cell.y].isHidden = false;

  const neighbors = findingNeighbors(grid, cell.x, cell.y);
  const neighborsWithoutBomb = neighbors.filter(n => n.value >= 0 && n.isHidden);

  neighborsWithoutBomb.forEach(n => {
    grid[n.x][n.y].isHidden = false;

    if(n.value === 0) discover(n, grid, dispatch);
  });

  dispatch({ type: 'set', grid });
};

const generateGrid = (size, mine, dispatch) => {
  let grid = [];
  let randomBomb = [];

  // generate random bomb
  for (let j = 0; j < mine; j++) {
    randomBomb.push({ x: randomNumber(0, size), y: randomNumber(0, size) });
  }

  for (let row = 0; row < size; row++) {
    grid.push([]);

    for (let col = 0; col < size; col++) {
      let cell = {
        x: row,
        y: col,
        value: TYPE_CELL.NORMAL,
        isHidden: true
      };

      // insert bomb
      if (randomBomb.some(({ x, y }) => y === col && x === row)) {
        cell.value = TYPE_CELL.BOMB;
      }

      // assign value
      if (cell.value !== TYPE_CELL.BOMB) {
        cell.value = increaseValue(grid, { x: row, y: col }, randomBomb);
      }

      grid[row][col] = cell;
    }
  }

  dispatch({ type: 'set', grid });
};

const Grid = ({ size = 10, mine = 1, isDebugging }: GridProps) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { grid } = state;

  useEffect(() => {
    generateGrid(size, mine, dispatch);
  }, [size, mine]);

  return (
    <table className="grid">
      <tbody>
        {state.grid.map((row, i) => (
          <tr key={i}>
            {row.map((col, j) => (
              <Cell
                key={j}
                value={col.value}
                isBomb={col.value === TYPE_CELL.BOMB}
                isHidden={col.isHidden && !isDebugging}
                showCell={() => discover(col, grid, dispatch)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Grid;
