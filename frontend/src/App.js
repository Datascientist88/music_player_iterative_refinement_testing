// src/App.js
import React, { useState, useEffect } from 'react';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import CardSwiper from './components/CardSwiper/CardSwiper';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
    const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
    const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    // Apply theme to the body element
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="App">
            <header className="app-header">
                <h1>Aries Music ♈</h1>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </header>

            <main>
                {/* --- ORDER CHANGED HERE --- */}
                <MusicPlayer trackUrl={currentTrackUrl} />
                <CardSwiper onPlayTrack={setCurrentTrackUrl} />
            </main>

            <footer>
                <p className="disclaimer">
                    Original player visuals by <b id="disclaimer">8351m</b>. React integration by <b>Mohmmed Bahageel</b>.
                </p>
            </footer>
        </div>
    );
}

export default App;