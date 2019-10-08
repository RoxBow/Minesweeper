import React, { useState, useEffect } from 'react';
import Grid from './components/Grid/Grid';
import './App.scss';

const App = () => {
  const [isDebugging, setDebugging] = useState(false);
  const [size, setSize] = useState(10);
  const [mine, setMine] = useState(8);

  useEffect(() => {
    setSize(Number(window.prompt('Nombre de case ?', 10)));
    setMine(Number(window.prompt('Nombre de mine ?', 8)));

    if (mine >= (size * size)) {
      setSize(Number(window.prompt('Nombre de case ?', 10)));
    }
  }, [size, mine]);

  return (
    <div className="app">
      <header>
        <h1>Minesweeper</h1>
        <button className="btn-debug" onClick={() => setDebugging(!isDebugging)}>
          Mode debug
        </button>
      </header>

      <Grid size={size} mine={mine} isDebugging={isDebugging} />
    </div>
  );
};

export default App;
