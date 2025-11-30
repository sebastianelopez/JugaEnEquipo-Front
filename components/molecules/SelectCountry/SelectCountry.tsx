import { Select, MenuItem, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  height?: number;
  fullWidth?: boolean;
}

export const SelectCountry = ({ height, fullWidth = false }: Props) => {
  const t = useTranslations("Global");
  const { asPath, locale, push, query, pathname } = useRouter();
  const [selectValue, setSelectValue] = useState(locale ? locale : "en");

  const onSelectChange = (newLocale: string) => {
    setSelectValue(newLocale);
    push({ pathname, query }, asPath, { locale: newLocale });
  };

  const languages = [
    { code: "es", flag: "fi-ar", name: t("spanish") },
    { code: "en", flag: "fi-us", name: t("english") },
    { code: "pt", flag: "fi-br", name: t("portuguese") },
  ];
  const menuItemStyle = {
    display: fullWidth ? "flex" : undefined,
    justifyContent: fullWidth ? "left" : undefined,
    alignItems: "center",
    gap: 1,
  };

  return (
    <Select
      variant="outlined"
      value={selectValue}
      fullWidth={fullWidth}
      onChange={(e) => onSelectChange(e.target.value)}
      renderValue={(value) => {
        const language = languages.find((lang) => lang.code === value);
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span className={`fi ${language?.flag}`} />
            {fullWidth && <span>{language?.name}</span>}
          </Box>
        );
      }}
      inputProps={{ "aria-label": t("selectLanguage") }}
      sx={{ height }}
    >
      {languages.map((language) => (
        <MenuItem key={language.code} value={language.code} sx={menuItemStyle}>
          <span className={`fi ${language.flag}`} />
          {fullWidth && <span>{language.name}</span>}
        </MenuItem>
      ))}
    </Select>
  );
};
