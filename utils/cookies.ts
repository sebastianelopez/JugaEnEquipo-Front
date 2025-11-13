/**
 * Cookie utilities for theme management
 */

export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  
  return null;
};

export const setCookie = (name: string, value: string, days: number = 365): void => {
  if (typeof window === "undefined") return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getThemeFromCookie = (): "light" | "dark" => {
  const theme = getCookie("themeMode");
  return theme === "dark" ? "dark" : "light";
};

export const setThemeCookie = (theme: "light" | "dark"): void => {
  setCookie("themeMode", theme);
};

// Server-side cookie parsing for Next.js
export const parseCookies = (cookieString?: string): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  if (!cookieString) return cookies;
  
  cookieString.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length > 0) {
      cookies[name] = rest.join('=');
    }
  });
  
  return cookies;
};