"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import sebastian from "../../../assets/sebastian-lopez.png";
import marcos from "../../../assets/marcos-romero.jpeg";

export function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const team = [
    {
      name: "Sebastián",
      role: "Co-Fundador & CEO",
      image: sebastian.src,
      description: "Frontend Developer",
    },
    {
      name: "Marcos",
      role: "Co-Fundadora & CTO",
      image: marcos.src,
      description: "Backend Developer",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
      id="about"
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <Chip
            label="SOBRE NOSOTROS"
            sx={{
              mb: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: 1,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Nuestra Misión
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Conectar gamers de todo el mundo en una plataforma donde puedan
            encontrar compañeros de equipo, compartir experiencias y crecer
            juntos en el mundo del gaming
          </Typography>
        </Box>

        {/* Team Members */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, sm: 8, md: 12, lg: 20 },
            mb: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "200px",
              pointerEvents: "none",
              zIndex: 0,
              opacity: 0.6,
            }}
          >
            <svg
              width="100%"
              height="200"
              viewBox="0 0 1920 200"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient
                  id={`brand-gradient`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#6C5CE7", stopOpacity: 1 }}
                  />
                  <stop
                    offset="25%"
                    style={{ stopColor: "#00CEC9", stopOpacity: 1 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#00B894", stopOpacity: 1 }}
                  />
                  <stop
                    offset="75%"
                    style={{ stopColor: "#00CEC9", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#6C5CE7", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                d="M 0 100 Q 320 50, 640 100 T 1280 100 T 1920 100"
                fill="none"
                stroke={`url(#brand-gradient)`}
                strokeWidth="6"
                strokeDasharray="25 15"
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="40"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M 0 130 Q 384 80, 768 130 T 1536 130 T 1920 130"
                fill="none"
                stroke={`url(#brand-gradient)`}
                strokeWidth="4"
                strokeDasharray="20 10"
                strokeLinecap="round"
                opacity="0.7"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="30"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </Box>
          {team.map((member, index) => (
            <Box
              key={index}
              sx={{
                flex: { xs: "1 1 100%", md: "0 1 45%" },
                maxWidth: { md: "45%" },
              }}
            >
              <Box
                sx={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.6s ease-out ${index * 0.2}s`,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    mb: { xs: 2, sm: 2.5, md: 3 },
                  }}
                >
                  <Box
                    className="member-image"
                    component="img"
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: { xs: 200, sm: 280, md: 350, lg: 450 },
                      height: { xs: 200, sm: 280, md: 350, lg: 450 },
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: {
                        xs: "0 0 15px rgba(168, 85, 247, 0.4)",
                        md: "0 0 30px rgba(168, 85, 247, 0.4)",
                      },
                      transition: "all 0.3s ease",
                      animation: "float 3s ease-in-out infinite",
                      animationDelay: `${index * 0.5}s`,
                    }}
                  />
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: { xs: 200, sm: 280, md: 350, lg: 450 },
                      height: { xs: 200, sm: 280, md: 350, lg: 450 },
                      borderRadius: "50%",
                      background:
                        "linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.8) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Texto curvo abajo de la imagen */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: { xs: 200, sm: 280, md: 350, lg: 450 },
                      height: { xs: 200, sm: 280, md: 350, lg: 450 },
                      pointerEvents: "none",
                    }}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 450 450"
                      style={{ overflow: "visible" }}
                    >
                      <defs>
                        <path
                          id={`curve-${index}`}
                          d="M -15 225 A 225 225 0 0 0 225 450"
                          fill="none"
                        />
                        <filter id={`shadow-${index}`}>
                          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                          <feOffset dx="0" dy="2" result="offsetblur" />
                          <feComponentTransfer>
                            <feFuncA type="linear" slope="0.5" />
                          </feComponentTransfer>
                          <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <text
                        fontSize="72"
                        fontWeight="bold"
                        fill="#00CEC9"
                        textAnchor="start"
                        filter={`url(#shadow-${index})`}
                        letterSpacing="2"
                      >
                        <textPath href={`#curve-${index}`} startOffset="5%">
                          {member.name}
                        </textPath>
                      </text>
                    </svg>
                  </Box>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  }}
                >
                  {member.role}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    maxWidth: 300,
                    mx: "auto",
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.875rem" },
                  }}
                >
                  {member.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
