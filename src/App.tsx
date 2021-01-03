import React from 'react';
import './App.css';
import InputTable from './components/InputTable'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Enter your portfolio and see where your <em>risk</em> is allocated.
        </p>
      </header>
      <div className="full-container">
        <div className="container padding-top">
          <InputTable/>
        </div>
      </div>
      <footer>
        <p>Another dumb project by <a href="https://stevehind.me">Steve</a>© 2021.</p>
      </footer>
    </div>
  );
}

export default App;
