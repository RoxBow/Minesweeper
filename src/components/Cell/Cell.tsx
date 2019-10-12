import React, { FunctionComponent } from 'react';
import './Cell.scss';
import { ReactComponent as Flag } from '../../assets/img/flag.svg';
import { ReactComponent as Bomb } from '../../assets/img/bomb.svg';
import { CLICK } from '../../constants';

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (e.button === 0) {
    return CLICK.LEFT;
  } else if (e.button === 2) {
    return CLICK.RIGHT;
  }
};

interface CellProps {
  isBomb: boolean;
  isFlag: boolean | undefined;
  isHidden: boolean;
  value: number;
  showCell: () => void;
  toggleFlag: () => void;
}

const Cell: FunctionComponent<CellProps> = ({
  isBomb,
  isHidden,
  showCell,
  toggleFlag,
  isFlag,
  value
}) => (
  <td className="cell">
    <div>
      {!isHidden ? (
        isBomb ? (
          <Bomb />
        ) : (
          <span className="value">{value}</span>
        )
      ) : isFlag ? (
        <button onContextMenu={toggleFlag} className="btn-flag">
          <Flag />
        </button>
      ) : (
        <button
          className="btn-cell-hidden"
          onContextMenu={e => (handleClick(e) === CLICK.LEFT ? showCell() : toggleFlag())}
          onClick={e => (handleClick(e) === CLICK.LEFT ? showCell() : toggleFlag())}
        />
      )}
    </div>
  </td>
);

export default Cell;
