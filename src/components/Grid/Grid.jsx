import React, { useEffect, useReducer } from 'react';
import './Grid.scss';
import Cell from '../Cell/Cell';
import { TYPE_CELL } from '../../constants';
import { randomNumber, findAdjacents } from '../../helpers';

type GridProps = {
  isDebugging: Boolean,
  size: Number,
  mine: Number
};

const initState = {
  grid: []
};

const increaseValue = (cell, randomBomb) => {
  const { x, y } = cell;

  const matchedBomb = randomBomb.filter(
    ({ x: bombX, y: bombY }) =>
      (x - 1 === bombX && bombY >= y - 1 && bombY <= y + 1) ||
      (x + 1 === bombX && bombY >= y - 1 && bombY <= y + 1) ||
      (y - 1 === bombY && bombX === x) ||
      (y + 1 === bombY && bombX === x)
  );

  return matchedBomb.length;
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
  // losing case
  if(cell.value === TYPE_CELL.BOMB) {
    alert('C\'est fini, tu as cliqué sur une bombe');
    window.location.reload();
    return;
  }

  grid[cell.x][cell.y].isHidden = false;

  const adjacentCell = findAdjacents(grid, cell.x, cell.y);
  const cleanAdjacentCell = adjacentCell.filter(c => c.value >= 0 && c.isHidden);

  cleanAdjacentCell.forEach(n => {
    grid[n.x][n.y].isHidden = false;

    if (n.value === 0) discover(n, grid, dispatch);
  });

  dispatch({ type: 'set', grid });
};

const generateRandomBomb = (mine, size) => {
  let randomBomb = [];

  while (randomBomb.length < mine) {
    const x = randomNumber(0, size);
    const y = randomNumber(0, size);

    if (!randomBomb.some(bomb => bomb.x === x && bomb.y === y)) {
      randomBomb.push({ x, y });
    }
  }

  return randomBomb;
};

const generateGrid = (size, mine, dispatch) => {
  let grid = [];

  const randomBomb = generateRandomBomb(mine, size);

  for (let row = 0; row < size; row++) {
    grid.push([]);

    for (let col = 0; col < size; col++) {
      let cell = {
        x: row,
        y: col,
        value: TYPE_CELL.NORMAL,
        isHidden: true
      };

      // assign bomb
      if (randomBomb.some(({ x, y }) => y === col && x === row)) {
        cell.value = TYPE_CELL.BOMB;
      }

      // assign value
      if (cell.value !== TYPE_CELL.BOMB) {
        cell.value = increaseValue(cell, randomBomb);
      }

      grid[row][col] = cell;
    }
  }

  dispatch({ type: 'set', grid });
};

const Grid = ({ size = 10, mine = 1, isDebugging }: GridProps) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { grid } = state;

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
