import { Select, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export const SelectCountry = () => {
    const { asPath, locale, push, query, pathname } = useRouter();
  const [selectValue, setSelectValue] = useState(locale ? locale : "en");

  const onSelectChange = (newLocale: string) => {
    setSelectValue(newLocale);
    push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Select
      variant="outlined"
      value={selectValue}
      onChange={(e) => onSelectChange(e.target.value)}
    >
      <MenuItem value={"es"}>
        <span className="fi fi-ar" />
      </MenuItem>
      <MenuItem value={"en"}>
        <span className="fi fi-us" />
      </MenuItem>
      <MenuItem value={"pt"}>
        <span className="fi fi-br" />
      </MenuItem>
    </Select>
  );
};
