// src/App.js
import React, { useState, useEffect } from 'react';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import CardSwiper from './components/CardSwiper/CardSwiper';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import SoundVisualizer from './components/SoundVisualizer/SoundVisualizer'; // <-- Import new visualizer
import './App.css';

function App() {
    // State is now managed by Zustand, so we only handle the theme here.
    const [theme, setTheme] = useState('dark'); 

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };
    
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="App">
            <header className="app-header">
                <h1>Aries Music</h1>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </header>

            <main>
                <MusicPlayer /> {/* No more props needed */}
                <CardSwiper />  {/* No more props needed */}
                <SoundVisualizer /> {/* <-- Render the new visualizer */}
            </main>
            
                    </div>
    );
}

export default App;