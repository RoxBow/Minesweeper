import React, { useState } from 'react';
import Grid from './components/Grid/Grid';
import GridForm from './components/GridForm/GridForm';
import './App.scss';

const App = () => {
  const [isDebugging, setDebugging] = useState(false);
  const [size, setSize] = useState(0);
  const [mine, setMine] = useState(0);

  const setParametersGrid = (size: number, mine: number) => {
    setSize(size);
    setMine(mine);
  };

  return (
    <div className="app">
      <header>
        <h1>Minesweeper</h1>
        {size >= 1 && (
          <div className="group-action">
            <button onClick={() => setParametersGrid(0, 0)}>Restart</button>
            <button onClick={() => setDebugging(!isDebugging)}>Debug mode</button>
          </div>
        )}
      </header>
      {!size ? (
        <GridForm handleSubmit={setParametersGrid} />
      ) : (
        <Grid size={size} mine={mine} isDebugging={isDebugging} restartGame={() => setParametersGrid(0, 0)} />
      )}
    </div>
  );
};

export default App;
