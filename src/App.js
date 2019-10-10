import React, { useState, useEffect } from 'react';
import Grid from './components/Grid/Grid';
import './App.scss';

const App = () => {
  const [isDebugging, setDebugging] = useState(false);
  const [size, setSize] = useState(0);
  const [mine, setMine] = useState(0);

  useEffect(() => {
    if (mine >= size * size || !size) setSize(Number(window.prompt('Nombre de case ?', 10)));

    if (!mine) setMine(Number(window.prompt('Nombre de mine ?', 12)));
  }, [size, mine]);

  return (
    <div className="app">
      <header>
        <h1>Minesweeper</h1>
        <button className="btn-debug" onClick={() => setDebugging(!isDebugging)}>
          Debug mode
        </button>
      </header>

      <Grid size={size} mine={mine} isDebugging={isDebugging} />
    </div>
  );
};

export default App;
