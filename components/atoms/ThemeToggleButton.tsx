"use client";

import { IconButton, Tooltip } from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { useContext } from "react";
import { useTranslations } from "next-intl";
import { UiContext } from "../../context";

export const ThemeToggleButton = () => {
  const { themeMode, toggleTheme } = useContext(UiContext);
  const tGlobal = useTranslations("Global");

  return (
    <Tooltip
      title={
        themeMode === "dark"
          ? tGlobal("switchToLightMode")
          : tGlobal("switchToDarkMode")
      }
    >
      <IconButton
        onClick={toggleTheme}
        aria-label={tGlobal("toggleTheme")}
        sx={{
          color: "text.primary",
        }}
      >
        {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

