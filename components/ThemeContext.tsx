"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light"); // Sempre inicia com tema claro
  const [mounted, setMounted] = useState(false);

  // Carrega o tema salvo no localStorage quando o componente monta
  useEffect(() => {
    const savedTheme = localStorage.getItem("monitoragro-theme") as Theme | null;
    
    // Só usa o tema salvo se existir, caso contrário mantém "light" como padrão
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setThemeState(savedTheme);
    }
    
    setMounted(true);
  }, []);

  // Aplica o tema ao documento quando ele muda
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    // Remove ambas as classes primeiro
    root.classList.remove("light", "dark");
    
    // Adiciona a classe do tema atual
    root.classList.add(theme);
    
    // Salva a preferência no localStorage
    localStorage.setItem("monitoragro-theme", theme);
    
    // Log para debug
    console.log(`Tema alterado para: ${theme}`);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => prev === "light" ? "dark" : "light");
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Não renderiza nada até que o componente tenha montado para evitar hidratação inconsistente
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}