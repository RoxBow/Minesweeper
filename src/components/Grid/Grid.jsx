import React, { useEffect, useReducer } from 'react';
import './Grid.scss';
import Cell from '../Cell/Cell';
import { TYPE_CELL, STATE_GAME } from '../../constants';
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

const getStateGame = grid => {
  let stateGame = STATE_GAME.WIN;
  
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      const cell = grid[x][y];

      if(cell.isHidden && !(cell.value === TYPE_CELL.BOMB) && !cell.isFlag){
        stateGame = null;
        break;
      } else if(cell.isHidden && !(cell.value === TYPE_CELL.BOMB) && cell.isFlag){
        stateGame = STATE_GAME.LOSE;
        break;
      } else {
        continue;
      }
    }
  }

  return stateGame;
}

const setFlag = (cell, grid, dispatch) => {
  grid[cell.x][cell.y].isFlag = true;
  dispatch({ type: 'set', grid });
}

const showCell = (cell, grid, dispatch) => {

  // losing case
  if(cell.value === TYPE_CELL.BOMB) {
    alert('You clicked on a bomb, sorry');
    window.location.reload();
    return;
  }

  grid[cell.x][cell.y].isHidden = false;

  const adjacentCell = findAdjacents(grid, cell.x, cell.y);
  const adjacentCellToShow = adjacentCell.filter(c => c.value >= 0 && c.isHidden && !c.isFlag);

  adjacentCellToShow.forEach(c => {
    grid[c.x][c.y].isHidden = false;

    if (c.value === 0) showCell(c, grid, dispatch);
  });

  dispatch({ type: 'set', grid });

  const stateGame = getStateGame(grid);

  if(stateGame === STATE_GAME.WIN){
    alert('WINNEEEERRR !!!!!');
  } else if(stateGame === STATE_GAME.LOSE){
    alert('Flag(s) at the wrong position, it\'s lose !');
    window.location.reload();
  } else {
    return;
  }
};

const generateRandomBomb = (mine, size) => {
  let randomBomb = [];

  while (randomBomb.length < mine) {
    const x = randomNumber(0, size);
    const y = randomNumber(0, size);

    // unique position bomb
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
                isFlag={col.isFlag}
                isHidden={col.isHidden && !isDebugging}
                showCell={() => showCell(col, grid, dispatch)}
                setFlag={() => setFlag(col, grid, dispatch)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Grid;
