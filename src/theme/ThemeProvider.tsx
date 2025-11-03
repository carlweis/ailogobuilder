import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

const ThemeContext = createContext<{
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
} | null>(null);

const THEME_KEY = "ai-logo-theme";

export function ThemeProvider({ children }: PropsWithChildren): JSX.Element {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const setTheme = useCallback((next: "light" | "dark") => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, next);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): { theme: "light" | "dark"; toggle: () => void } {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return { theme: context.theme, toggle: () => context.setTheme(context.theme === "light" ? "dark" : "light") };
}
