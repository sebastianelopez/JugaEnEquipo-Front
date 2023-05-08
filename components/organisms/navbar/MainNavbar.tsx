import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Icon,
  IconButton,
  Input,
  Link,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useRef } from "react";
import { UiContext } from "../../../context";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";

import logo from "./../../../assets/logo.png";

export const MainNavbar = () => {
  const { asPath, locale, push, query, pathname } = useRouter();

  const { toggleSideMenu } = useContext(UiContext);

  const t = useTranslations("Navbar");

  const [selectValue, setSelectValue] = useState(locale ? locale : "en");

  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleExpand = () => {
    setIsExpanded(true);
    if(inputRef.current){
      inputRef.current.focus();
    }     
  };

  const handleCollapse = () => {
    setIsExpanded(false);
  };

  const onSelectChange = (newLocale: string) => {
    setSelectValue(newLocale);
    push({ pathname, query }, asPath, { locale: newLocale });
  };

  const logotitle = ".logotitle";

  useEffect(() => {
    gsap.from(logotitle, {
      opacity: 1,
      x: 100,
      duration: 2,
    });
  }, []);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems="center"
              component="div"
            >
              <Image src={logo} height={40} width={70} />
              <Typography className="logotitle">Juga en equipo</Typography>
            </Box>
          </Link>
        </NextLink>

        <Box component="div" flex={1} />

        <Box
          component="div"
          sx={{
            display: { xs: "none", sm: "block" },
          }}
        >
          <NextLink href={"/home"} passHref>
            <Link>
              <IconButton children={<HomeIcon />} />
            </Link>
          </NextLink>
          <NextLink href={"/messages"} passHref>
            <Link>
              <IconButton children={<MessageIcon />} />
            </Link>
          </NextLink>
          <IconButton children={<NotificationsIcon />} />
          
          <Input
            placeholder={t("search")}
            inputRef={inputRef}            
            sx={{
              maxWidth: isExpanded ? 300 : 0,
              transition: "max-width 0.3s ease",
            }}
            onBlur={handleCollapse}
            endAdornment={
              <IconButton onClick={handleExpand}>
                <SearchOutlined />
              </IconButton>
            }
          />
        </Box>
        <Box component="div" flex={1} />
        <Select
          variant="outlined"
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}
          sx={{
            height: 35,
            width: 70,
            mr: 3,
          }}
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
        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
