import React, { FunctionComponent, Dispatch, useEffect, useReducer } from 'react';
import './Grid.scss';
import Cell from '../Cell/Cell';
import { TYPE_CELL, STATE_GAME } from '../../constants';
import { randomNumber, findAdjacents } from '../../helpers';

type StateType = {
  grid: GridType;
};

type ActionType = {
  type: 'set';
  grid: GridType;
};

type GridType = Cell[][];

interface Cell {
  x: number;
  y: number;
  value: number;
  isHidden: boolean;
  isFlag?: boolean;
}

interface GridProps {
  isDebugging: boolean;
  size: number;
  mine: number;
  restartGame: () => void;
}

type RandomBombType = Array<{ x: number; y: number }>;

const increaseValueCell = (cell: Cell, randomBomb: RandomBombType) => {
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

const getStateGame = (grid: GridType) => {
  let stateGame: string | null = STATE_GAME.WIN;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      const cell = grid[x][y];

      if (cell.isHidden && !(cell.value === TYPE_CELL.BOMB) && !cell.isFlag) {
        stateGame = null;
        break;
      } else if (cell.isHidden && !(cell.value === TYPE_CELL.BOMB) && cell.isFlag) {
        stateGame = STATE_GAME.LOSE;
        break;
      } else {
        continue;
      }
    }
  }

  return stateGame;
};

const toggleFlag = (
  cell: Cell,
  grid: GridType,
  dispatch: Dispatch<ActionType>,
  isFlag: boolean | undefined
) => {
  grid[cell.x][cell.y].isFlag = !isFlag;
  dispatch({ type: 'set', grid });
};

const showCell = (cell: Cell, grid: GridType, dispatch: Dispatch<ActionType>, restartGame: () => void) => {
  // losing case
  if (cell.value === TYPE_CELL.BOMB) {
    alert('You clicked on a bomb, sorry');
    restartGame();
    return;
  }

  grid[cell.x][cell.y].isHidden = false;

  const adjacentCell = findAdjacents(grid, cell.x, cell.y);
  const adjacentCellToShow = adjacentCell.filter(
    (c: Cell) => c.value >= 0 && c.isHidden && !c.isFlag
  );

  adjacentCellToShow.forEach((c: Cell) => {
    grid[c.x][c.y].isHidden = false;

    if (c.value === 0) showCell(c, grid, dispatch, restartGame);
  });

  dispatch({ type: 'set', grid });

  const stateGame = getStateGame(grid);

  if (stateGame === STATE_GAME.WIN) {
    alert('WINNEEEERRR !!!!!');
    restartGame();
  } else if (stateGame === STATE_GAME.LOSE) {
    alert("Flag(s) at the wrong position, it's lose !");
    restartGame();
  } else {
    return;
  }
};

const generateRandomBomb = (mine: number, size: number) => {
  let randomBomb: RandomBombType = [];

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

const generateGrid = (size: number, mine: number, dispatch: Dispatch<ActionType>) => {
  let grid: GridType = [];

  const randomBomb: RandomBombType = generateRandomBomb(mine, size);

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
        cell.value = increaseValueCell(cell, randomBomb);
      }

      grid[row][col] = cell;
    }
  }

  dispatch({ type: 'set', grid });
};

const initState = {
  grid: []
};

const reducer: React.Reducer<StateType, ActionType> = (state, action) => {
  switch (action.type) {
    case 'set':
      return { grid: action.grid };
    default:
      throw new Error();
  }
};

const Grid: FunctionComponent<GridProps> = ({ size, mine, isDebugging, restartGame }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { grid } = state;

  useEffect(() => {
    generateGrid(size, mine, dispatch);
  }, [size, mine]);

  return (
    <table className="grid">
      <tbody>
        {state.grid.map((row: Array<Cell>, i: number) => (
          <tr key={i}>
            {row.map((cell: Cell, j: number) => (
              <Cell
                key={j}
                value={cell.value}
                isBomb={cell.value === TYPE_CELL.BOMB}
                isFlag={cell.isFlag}
                isHidden={cell.isHidden && !isDebugging}
                showCell={() => showCell(cell, grid, dispatch, restartGame)}
                toggleFlag={() => toggleFlag(cell, grid, dispatch, cell.isFlag)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Grid;
