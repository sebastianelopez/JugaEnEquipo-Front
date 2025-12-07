import { setThemeCookie } from "./cookies";

export interface UserPreferences {
  theme?: "light" | "dark";
  lang?: "es" | "en" | "pt";
}

export const applyUserPreferences = (preferences: UserPreferences) => {
  if (typeof window === "undefined") return;

  if (preferences.theme) {
    setThemeCookie(preferences.theme);
    window.dispatchEvent(
      new CustomEvent("user-preferences-changed", {
        detail: { type: "theme", value: preferences.theme },
      })
    );
  }

  if (preferences.lang) {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(es|en|pt)/, "") || currentPath;
    const newPath = `/${preferences.lang}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    
    if (newPath !== currentPath) {
      window.location.href = newPath;
    }
  }
};

