import React from 'react';
import './Cell.scss';
import { ReactComponent as Flag } from '../../assets/img/flag.svg';
import { ReactComponent as Bomb } from '../../assets/img/bomb.svg';
import { CLICK } from '../../constants';

type CellProps = {
  isBomb: Boolean,
  isHidden: Boolean,
  value: Number,
  showCell: Function,
  setFlag: Function
};

const handleClick = e => {
  if (e.button === 0) {
    return CLICK.LEFT;
  } else if (e.button === 2) {
    return CLICK.RIGHT;
  }
};

const Cell = ({ isBomb, isHidden, showCell, setFlag, isFlag, value }: CellProps) => (
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
        onContextMenu={e => (handleClick(e) === CLICK.LEFT ? showCell() : setFlag())}
        onClick={e => (handleClick(e) === CLICK.LEFT ? showCell() : setFlag())}
      />
    )}
  </td>
);

export default Cell;
