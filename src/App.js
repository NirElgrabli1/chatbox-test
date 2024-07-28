// src/App.js
import React from 'react';
import Chatbox from './Chatbox';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ChatGPT Chatbox</h1>
      </header>
      <main>
        <Chatbox />
      </main>
    </div>
  );
}

export default App;
