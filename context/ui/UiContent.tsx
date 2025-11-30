import { createContext } from "react";

interface ContextProps {
  isMenuOpen: boolean;
  toggleSideMenu: () => void;

  themeMode: "light" | "dark";
  toggleTheme: () => void;
}

export const UiContext = createContext({} as ContextProps);
