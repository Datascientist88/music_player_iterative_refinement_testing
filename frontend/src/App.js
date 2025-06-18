import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import './App.css';

function App() {
  return (
    <div className="App">
        <div className="content">
          <MusicPlayer />
          {/* The SoundVisualizer component will be added here later */}
          {/* <SoundVisualizer /> */}
        </div>

    </div>
  );
}

export default App;