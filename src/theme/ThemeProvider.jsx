import React, { createContext, useContext, useEffect, useState } from "react";
import defaultThemes from "./themes";

const ThemeContext = createContext(null);

const THEMES_KEY = "app_themes_v1";
const THEME_NAME_KEY = "app_theme_name_v1";

function applyThemeToDOM(theme) {
  if (!theme) return;
  const root = document.documentElement;
  const { colors = {}, fontFamily } = theme;
  Object.entries(colors).forEach(([k, v]) => {
    root.style.setProperty(`--${k}`, v);
  });
  if (fontFamily) root.style.setProperty("--font-family", fontFamily);
}

export function ThemeProvider({ children }) {
  const [themes, setThemes] = useState(() => {
    try {
      const saved = localStorage.getItem(THEMES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultThemes;
  });

  const [currentName, setCurrentName] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_NAME_KEY);
      if (saved) return saved;
    } catch (e) {}
    return "light" in defaultThemes ? "light" : Object.keys(defaultThemes)[0];
  });

  const currentTheme = themes[currentName] || Object.values(themes)[0];

  useEffect(() => {
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
    } catch (e) {}
  }, [themes]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_NAME_KEY, currentName);
    } catch (e) {}
  }, [currentName]);

  const setTheme = (name) => {
    if (themes[name]) setCurrentName(name);
  };

  const addTheme = (name, themeObj) => {
    setThemes((prev) => ({ ...prev, [name]: themeObj }));
    setCurrentName(name);
  };

  const updateTheme = (name, patch) => {
    setThemes((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  };

  return (
    <ThemeContext.Provider
      value={{
        themes,
        currentName,
        currentTheme,
        setTheme,
        addTheme,
        updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default ThemeProvider;
