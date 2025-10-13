import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  PresentationControls,
  Environment,
  ContactShadows,
  Float,
  Stars,
  Sparkles,
  Html,
} from "@react-three/drei";
import { MobilePhone3D } from "./MobilePhone3D";
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import { useTranslations } from "next-intl";

interface MobileAppPromotionProps {
  screenImage: string;
  title: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  showStars?: boolean;
  backgroundColor?: string;
}

export const MobileAppPromotion: React.FC<MobileAppPromotionProps> = ({
  screenImage,
  title,
  description,
  ctaText,
  onCtaClick,
  showStars = true,
  backgroundColor,
}) => {
  const theme = useTheme();
  const t = useTranslations("MobileApp");

  const defaultBgColor =
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "600px",
        height: "100%",
        background: backgroundColor || defaultBgColor,
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-around",
        padding: { xs: 3, md: 4 },
        boxShadow: theme.shadows[10],
      }}
    >
      {/* Text Content */}
      <Box
        sx={{
          flex: 1,
          zIndex: 2,
          maxWidth: { xs: "100%", md: "45%" },
          textAlign: { xs: "center", md: "left" },
          mb: { xs: 3, md: 0 },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: alpha("#ffffff", 0.15),
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              padding: "10px 18px",
              border: `1px solid ${alpha("#ffffff", 0.2)}`,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: alpha("#ffffff", 0.25),
                transform: "translateY(-2px)",
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: alpha("#ffffff", 0.9),
                fontWeight: 500,
                fontSize: "0.85rem",
                mr: 0.5,
              }}
            >
              {t("availableOn")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1,
                py: 0.5,
                backgroundColor: alpha("#ffffff", 0.2),
                borderRadius: 2,
              }}
            >
              <AndroidIcon sx={{ fontSize: 20, color: "#3DDC84" }} />
              <Box
                sx={{
                  width: "1px",
                  height: "16px",
                  backgroundColor: alpha("#ffffff", 0.3),
                }}
              />
              <AppleIcon sx={{ fontSize: 20, color: "#ffffff" }} />
            </Box>
          </Box>
        </Box>

        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 800,
            color: "#ffffff",
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: alpha("#ffffff", 0.9),
            mb: 4,
            lineHeight: 1.6,
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          {description || ""}
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<GetAppIcon />}
          onClick={onCtaClick}
          sx={{
            backgroundColor: "#ffffff",
            color: theme.palette.primary.main,
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 700,
            borderRadius: 3,
            textTransform: "none",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: alpha("#ffffff", 0.9),
              transform: "translateY(-2px)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.4)",
            },
          }}
        >
          {ctaText || t("downloadApp")}
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            mt: 4,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ color: "#ffffff", fontWeight: 700 }}>
              4.8
            </Typography>
            <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7) }}>
              {t("rating")}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ color: "#ffffff", fontWeight: 700 }}>
              50K+
            </Typography>
            <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7) }}>
              {t("downloads")}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ color: "#ffffff", fontWeight: 700 }}>
              10K+
            </Typography>
            <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7) }}>
              {t("reviews")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 3D Phone Canvas */}
      <Box
        sx={{
          flex: 1,
          height: { xs: "400px", md: "500px" },
          width: { xs: "100%", md: "50%" },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          component="span"
          sx={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            border: 0,
            clipPath: "inset(50%)",
          }}
        >
          3D iPhone model credit: sriniwasjha / Downloaded from pmndrs market
        </Box>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          style={{ height: "100%", width: "100%", touchAction: "none" }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />

          {/* Phone with interaction controls */}
          <Suspense
            fallback={
              <Html center>
                <CircularProgress sx={{ color: "white" }} />
              </Html>
            }
          >
            <PresentationControls
              global
              snap={true}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
              speed={2}
            >
              <Float
                speed={2}
                rotationIntensity={0.3}
                floatIntensity={0.5}
                floatingRange={[-0.1, 0.1]}
              >
                <MobilePhone3D
                  screenImage={screenImage}
                  rotation={[0.1, 0.2, 0]}
                  scale={1.3}
                />
                {/* Shadow under the phone - moves with the phone */}
                <ContactShadows
                  position={[0, -2.5, 0]}
                  opacity={0.4}
                  scale={8}
                  blur={2.5}
                  far={4}
                  resolution={1024}
                  frames={60}
                  color="#000000"
                />
              </Float>
            </PresentationControls>
          </Suspense>

          {/* Environment and effects */}
          <Environment preset="city" />

          {showStars && (
            <>
              <Stars
                radius={100}
                depth={50}
                count={500}
                factor={4}
                fade
                speed={1}
              />
              <Sparkles
                count={30}
                scale={8}
                size={2}
                speed={0.3}
                opacity={0.6}
                color="#ffffff"
              />
            </>
          )}
        </Canvas>
      </Box>

      {/* Decorative gradient orbs */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(138,43,226,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(67,97,238,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};
