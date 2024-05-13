import React, { createContext, useState, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

export function useDarkMode() {
    return useContext(DarkModeContext);
}

export function DarkModeProvider({ children }) {
    // Initialize dark mode state from local storage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedPreference = localStorage.getItem('isDarkMode');
        return savedPreference !== null ? JSON.parse(savedPreference) : false;
    });

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        // Save the new dark mode preference to local storage
        localStorage.setItem('isDarkMode', JSON.stringify(newMode));
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}
