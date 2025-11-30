import { Box, BoxProps } from "@mui/material";
import Image from "next/image";
import logo from "../../assets/logo.png";
import logoRightText from "../../assets/logo_right_text.png";

interface ResponsiveLogoProps extends Omit<BoxProps, 'children'> {
  /**
   * Size variant for the logos
   * @default "medium"
   */
  size?: "small" | "medium" | "large";
  /**
   * Alt text for the logo images
   * @default "Juga en Equipo logo"
   */
  altText?: string;
}

const sizeConfig = {
  small: {
    mobile: { height: 35, width: 35 },
    desktop: { height: 35, width: 100 }
  },
  medium: {
    mobile: { height: 45, width: 45 },
    desktop: { height: 45, width: 120 }
  },
  large: {
    mobile: { height: 55, width: 55 },
    desktop: { height: 55, width: 150 }
  }
};

export const ResponsiveLogo = ({ 
  size = "medium", 
  altText = "Juga en Equipo logo",
  ...boxProps 
}: ResponsiveLogoProps) => {
  const { mobile, desktop } = sizeConfig[size];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      component="div"
      {...boxProps}
    >
      {/* Logo for mobile (xs) screens only */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
        }}
      >
        <Image
          src={logo}
          height={mobile.height}
          width={mobile.width}
          alt={altText}
        />
      </Box>

      {/* Logo with text for small (sm) screens and up */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <Image
          src={logoRightText}
          height={desktop.height}
          width={desktop.width}
          alt={altText}
        />
      </Box>
    </Box>
  );
};