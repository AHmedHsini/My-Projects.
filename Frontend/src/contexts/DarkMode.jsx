import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from '../theme';

const DarkModeContext = createContext();

export function useDarkMode() {
    return useContext(DarkModeContext);
}

export function DarkModeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedPreference = localStorage.getItem('isDarkMode');
        return savedPreference !== null ? JSON.parse(savedPreference) : false;
    });

    useEffect(() => {
        const theme = isDarkMode ? darkTheme : lightTheme;
        Object.keys(theme).forEach(key => {
            document.documentElement.style.setProperty(`--${key}`, theme[key]);
        });
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('isDarkMode', JSON.stringify(newMode));
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}
