import React, { useState } from 'react';
import './Cell.scss';
import { ReactComponent as Flag } from '../../assets/img/flag.svg';
import { ReactComponent as Bomb } from '../../assets/img/bomb.svg';
import { CLICK } from '../../constants';

type CellProps = {
  isBomb: Boolean,
  isHidden: Boolean,
  value: Number,
  showCell: Function
};

const handleClick = e => {
  if (e.button === 0) {
    return CLICK.LEFT;
  } else if (e.button === 2) {
    return CLICK.RIGHT;
  }
};

const Cell = ({ isBomb, isHidden, showCell, value }: CellProps) => {
  const [isFlag, setFlag] = useState(false);

  return (
    <td className="cell">
      {isFlag || !isHidden ? (
        isFlag ? (
          <Flag />
        ) : isBomb ? (
          <Bomb />
        ) : (
          <span>{value}</span>
        )
      ) : (
        <button
          onContextMenu={e => (handleClick(e) === CLICK.LEFT ? showCell() : setFlag(true))}
          onClick={e => (handleClick(e) === CLICK.LEFT ? showCell() : setFlag(true))}
        />
      )}
    </td>
  );
};

export default Cell;
