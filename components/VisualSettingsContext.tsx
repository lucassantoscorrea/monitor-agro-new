"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface TypographySettings {
  fontFamily: string;
  fontSize: {
    small: string;
    base: string;
    large: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

interface TransitionSettings {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  timing: string;
  properties: string[];
}

interface IconSettings {
  size: {
    small: string;
    medium: string;
    large: string;
  };
  strokeWidth: number;
  style: 'outline' | 'filled' | 'duotone';
}

interface LayoutSettings {
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

interface VisualSettings {
  lightMode: ColorScheme;
  darkMode: ColorScheme;
  typography: TypographySettings;
  transitions: TransitionSettings;
  icons: IconSettings;
  layout: LayoutSettings;
}

interface VisualSettingsContextType {
  settings: VisualSettings;
  updateSettings: (newSettings: Partial<VisualSettings>) => void;
  resetToDefault: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

const defaultSettings: VisualSettings = {
  lightMode: {
    primary: "#16803D",
    secondary: "#F8FAFC",
    accent: "#ECFDF5",
    background: "#FAFAFA",
    foreground: "#1F2937",
    muted: "#64748B",
    border: "#D1D5DB",
    success: "#166534",
    warning: "#92400E",
    error: "#991B1B",
    info: "#1E40AF",
  },
  darkMode: {
    primary: "#22C55E",
    secondary: "#334155",
    accent: "#1E3A2E",
    background: "#0F172A",
    foreground: "#F8FAFC",
    muted: "#9CA3AF",
    border: "#475569",
    success: "#22C55E",
    warning: "#FB923C",
    error: "#EF4444",
    info: "#60A5FA",
  },
  typography: {
    fontFamily: "Open Sans",
    fontSize: {
      small: "0.75rem",
      base: "0.875rem",
      large: "1rem",
      xl: "1.25rem",
      xxl: "1.5rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
    },
  },
  transitions: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
    properties: ["background-color", "border-color", "color", "fill", "stroke", "box-shadow"],
  },
  icons: {
    size: {
      small: "16px",
      medium: "20px",
      large: "24px",
    },
    strokeWidth: 2,
    style: 'outline',
  },
  layout: {
    borderRadius: {
      small: "0.25rem",
      medium: "0.5rem",
      large: "0.75rem",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    shadows: {
      small: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      medium: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      large: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
  },
};

const VisualSettingsContext = createContext<VisualSettingsContextType | undefined>(undefined);

export function VisualSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<VisualSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Carrega configurações salvas do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("monitoragro-visual-settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.warn("Erro ao carregar configurações visuais:", error);
      }
    }
    setMounted(true);
  }, []);

  // Aplica configurações ao CSS quando mudarem
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const colorScheme = isDark ? settings.darkMode : settings.lightMode;

    // Aplica cores
    root.style.setProperty("--primary", colorScheme.primary);
    root.style.setProperty("--secondary", colorScheme.secondary);
    root.style.setProperty("--accent", colorScheme.accent);
    root.style.setProperty("--background", colorScheme.background);
    root.style.setProperty("--foreground", colorScheme.foreground);
    root.style.setProperty("--muted-foreground", colorScheme.muted);
    root.style.setProperty("--border", colorScheme.border);

    // Aplica tipografia
    root.style.setProperty("--font-family-sans", `'${settings.typography.fontFamily}', sans-serif`);
    root.style.setProperty("--font-size-base", settings.typography.fontSize.base);

    // Aplica transições
    root.style.setProperty("--transition-duration", settings.transitions.duration.normal);
    root.style.setProperty("--transition-timing", settings.transitions.timing);

    // Aplica layout
    root.style.setProperty("--radius", settings.layout.borderRadius.medium);

    // Salva no localStorage
    localStorage.setItem("monitoragro-visual-settings", JSON.stringify(settings));
  }, [settings, mounted]);

  const updateSettings = (newSettings: Partial<VisualSettings>) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("monitoragro-visual-settings");
  };

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (settingsJson: string) => {
    try {
      const parsedSettings = JSON.parse(settingsJson);
      setSettings({ ...defaultSettings, ...parsedSettings });
      return true;
    } catch (error) {
      console.error("Erro ao importar configurações:", error);
      return false;
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <VisualSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetToDefault,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </VisualSettingsContext.Provider>
  );
}

export function useVisualSettings() {
  const context = useContext(VisualSettingsContext);
  if (context === undefined) {
    throw new Error("useVisualSettings must be used within a VisualSettingsProvider");
  }
  return context;
}