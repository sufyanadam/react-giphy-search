import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    const style = {
      button: {
        marginLeft: 10,
        borderRadius: 4,
        width: 30,
        height: 22,
        textTransform: 'uppercase'
      }
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Search giphy!</h1>
          <input type="text" placeholder="search terms"/>
          <button style={style.button}>go</button>
        </header>
        <p className="App-intro">
          Show results here
        </p>
      </div>
    );
  }
}

export default App;
