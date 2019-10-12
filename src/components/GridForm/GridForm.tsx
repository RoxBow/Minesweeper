import React, { FunctionComponent, useState } from 'react';
import './GridForm.scss';

interface GridFormProps {
  handleSubmit: (size: number, mine: number) => void;
}

const GridForm: FunctionComponent<GridFormProps> = ({ handleSubmit }) => {
  const [size, setSize] = useState<number>(10);
  const [mine, setMine] = useState<number>(10);
  const [error, setError] = useState<string>('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (size < 1 || !size) {
      setError('Please enter a valid value for the size');
    } else if (size > 30) {
      setError('It may be a bit big');
    } else if (mine < 1 || !mine || mine >= size * size) {
      setError('Please enter a valid value for the number of mine');
    } else {
      handleSubmit(size, mine);
    }
  };

  return (
    <form method="post" onSubmit={onSubmit} className="grid-form">
      <p className="intro">Create your grid with your parameters</p>
      <div>
        <label htmlFor="field-size">Choose the size of your grid</label>
        <input
          name="size"
          id="field-size"
          value={size}
          type="number"
          min={1}
          max={31}
          onChange={e => setSize(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="field-mine">Choose the number of mine</label>
        <input
          name="mine"
          id="field-mine"
          value={mine}
          type="number"
          min={1}
          max={size * size}
          onChange={e => setMine(Number(e.target.value))}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <input value="Submit" type="submit" />
    </form>
  );
};

export default GridForm;
