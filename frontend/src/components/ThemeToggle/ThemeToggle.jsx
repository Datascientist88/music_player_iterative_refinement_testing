// src/components/ThemeToggle/ThemeToggle.js
import React, { useRef } from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
    const toggleRef = useRef(null);
    const isAnimating = useRef(false);

    const handleToggle = () => {
        if (isAnimating.current) return; // Prevent clicks during animation

        isAnimating.current = true;
        const animationType = theme === 'dark' ? 'roll' : 'rollback';
        const toggleElement = toggleRef.current;

        if (toggleElement) {
            toggleElement.classList.add(animationType);
        }
        
        // Change the theme in the parent component
        toggleTheme();

        // Remove animation class after it finishes
        setTimeout(() => {
            if (toggleElement) {
                toggleElement.classList.remove('roll', 'rollback');
            }
            isAnimating.current = false;
        }, 1500); // Duration of the animation
    };

    return (
        <div className="spectacledcoder-toggle-container">
            <div className="spectacledcoder-toggle-border">
                <div
                    ref={toggleRef}
                    className="spectacledcoder-toggle"
                    onClick={handleToggle}
                >
                </div>
            </div>
        </div>
    );
};

export default ThemeToggle;