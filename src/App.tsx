import React from 'react';
import './App.css';
import InputTable from './components/InputTable'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className="full-container">
        <div className="container">
          <InputTable/>
        </div>
      </div>
    </div>
  );
}

export default App;
