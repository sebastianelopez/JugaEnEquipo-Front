import { Box, BoxProps } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { useMemo } from "react";

interface BackgroundFallbackProps extends BoxProps {
  seed?: string; // Seed for generating consistent colors (username, team name, etc.)
  variant?: "user" | "team" | "tournament";
}

/**
 * Generates a beautiful animated gradient background based on a seed string
 * Creates consistent colors for the same seed
 */
const generateGradientFromSeed = (seed: string, variant: "user" | "team" | "tournament"): string => {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate colors based on variant and hash
  const colorSets = {
    user: [
      // Purple/Blue gradients
      ["#667eea", "#764ba2", "#f093fb"],
      ["#4facfe", "#00f2fe", "#43e97b"],
      ["#fa709a", "#fee140", "#30cfd0"],
      ["#a8edea", "#fed6e3", "#ffecd2"],
      ["#ff9a9e", "#fecfef", "#fecfef"],
    ],
    team: [
      // Blue/Green gradients
      ["#2193b0", "#6dd5ed", "#ee0979"],
      ["#0f2027", "#203a43", "#2c5364"],
      ["#134e5e", "#71b280", "#f5af19"],
      ["#1e3c72", "#2a5298", "#7e8ba3"],
      ["#0c3483", "#667eea", "#764ba2"],
    ],
    tournament: [
      // Orange/Red/Purple gradients
      ["#f12711", "#f5af19", "#667eea"],
      ["#ee0979", "#ff6a00", "#f12711"],
      ["#833ab4", "#fd1d1d", "#fcb045"],
      ["#c471ed", "#f64f59", "#4facfe"],
      ["#fa8bff", "#2bd2ff", "#2bff88"],
    ],
  };

  const colors = colorSets[variant];
  const colorIndex = Math.abs(hash) % colors.length;
  const selectedColors = colors[colorIndex];

  return `linear-gradient(135deg, ${selectedColors[0]} 0%, ${selectedColors[1]} 50%, ${selectedColors[2]} 100%)`;
};

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const BackgroundFallback: React.FC<BackgroundFallbackProps> = ({
  seed = "default",
  variant = "user",
  sx,
  ...props
}) => {
  const gradient = useMemo(() => generateGradientFromSeed(seed, variant), [seed, variant]);

  return (
    <Box
      {...props}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: gradient,
        backgroundSize: "200% 200%",
        animation: `${gradientShift} 15s ease infinite`,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
          pointerEvents: "none",
        },
        ...sx,
      }}
    />
  );
};

