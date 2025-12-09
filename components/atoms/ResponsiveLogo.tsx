import { Box, BoxProps } from "@mui/material";
import Image from "next/image";
import logo from "../../assets/juga-en-equipo_ISO-2-1.png";
import logoRightText from "../../assets/juga-en-equipo_blanco-1.png";
import logoRightTextViolet from "../../assets/juga-en-equipo_violeta-1.png";
import logoViolet from "../../assets/juga-en-equipo_ISO-1-1.png";

interface ResponsiveLogoProps extends Omit<BoxProps, "children"> {
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
  /**
   * Whether to use the violet logo
   * @default false
   */
  violet?: boolean;
}

const sizeConfig = {
  small: {
    mobile: { height: 35, width: 39 }, // ISO-2 aspect ratio: ~1.13:1
    desktop: { height: 35, width: 79 }, // blanco aspect ratio: ~2.26:1
  },
  medium: {
    mobile: { height: 45, width: 51 }, // ISO-2 aspect ratio: ~1.13:1
    desktop: { height: 45, width: 102 }, // blanco aspect ratio: ~2.26:1
  },
  large: {
    mobile: { height: 55, width: 62 }, // ISO-2 aspect ratio: ~1.13:1
    desktop: { height: 55, width: 124 }, // blanco aspect ratio: ~2.26:1
  },
};

export const ResponsiveLogo = ({
  size = "medium",
  altText = "Juga en Equipo logo",
  violet = false,
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
          src={violet ? logoViolet : logo}
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
          src={violet ? logoRightTextViolet : logoRightText}
          height={desktop.height}
          width={desktop.width}
          alt={altText}
        />
      </Box>
    </Box>
  );
};
