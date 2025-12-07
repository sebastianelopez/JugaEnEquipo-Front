import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/user";
import { UiContext } from "../context/ui";
import { userService } from "../services/user.service";

export const useUserPreferences = () => {
  const { user } = useContext(UserContext);
  const { themeMode } = useContext(UiContext);
  const router = useRouter();
  const previousThemeRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);

  const updatePreferences = async (preferences: { theme?: "light" | "dark"; lang?: "es" | "en" | "pt" }) => {
    if (user) {
      try {
        const payload: { theme?: "light" | "dark"; lang?: "es" | "en" | "pt" } = { ...preferences };
        
        if (preferences.theme && !preferences.lang) {
          const currentLang = (router.locale || "en") as "es" | "en" | "pt";
          payload.lang = currentLang;
        }
        
        console.log("Updating user preferences:", payload);
        await userService.updateUserPreferences(payload);
      } catch (error: any) {
        console.error("Error updating user preferences:", error);
        if (error?.response?.data) {
          console.error("Response data:", error.response.data);
        }
      }
    }
  };

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (themeMode) {
        previousThemeRef.current = themeMode;
      }
      return;
    }

    if (user && themeMode && previousThemeRef.current && previousThemeRef.current !== themeMode) {
      previousThemeRef.current = themeMode;
      updatePreferences({ theme: themeMode });
    }
  }, [themeMode, user]);

  useEffect(() => {
    if (!user) return;

    const handleThemeChange = (event: CustomEvent) => {
      if (event.detail.theme && previousThemeRef.current !== event.detail.theme) {
        previousThemeRef.current = event.detail.theme;
        updatePreferences({ theme: event.detail.theme });
      }
    };

    window.addEventListener("theme-changed", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("theme-changed", handleThemeChange as EventListener);
    };
  }, [user]);

  return { updatePreferences };
};

