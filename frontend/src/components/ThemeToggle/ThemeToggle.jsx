// src/components/ThemeToggle/ThemeToggle.js
import React from 'react';
import './ThemeToggle.css'; // Ensure you have the CSS for styling the toggle
const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <div>
            <input 
                type="checkbox" 
                className="checkbox" 
                id="checkbox" 
                onChange={toggleTheme}
                checked={theme === 'dark'}
            />
            <label htmlFor="checkbox" className="checkbox-label">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <span className="ball"></span>
            </label>
        </div>
    );
};

export default ThemeToggle;