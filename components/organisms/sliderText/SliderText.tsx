import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useTranslations } from "next-intl";
import { FC, useEffect, useRef } from "react";

interface Props {
  Text: string;
}

export const SliderText: FC<Props> = ({ Text }) => {
  const t = useTranslations("");

  const sliderText = useRef<HTMLDivElement>(null);
  const firstText = useRef<HTMLDivElement>(null);
  const secondText = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);

  gsap.registerPlugin(ScrollTrigger);

  let direction = -1;
  let xPercent = -100;

  useEffect(() => {
    const tlText = gsap.timeline({ repeat: -1 });
    const tlSlider = gsap.timeline({ repeat: -1 });

    tlText.fromTo(
      firstText.current,
      {
        xPercent: 0,
      },
      {
        xPercent,
        ease: "none",
        duration: 10,
      }
    );
    tlText.fromTo(
      secondText.current,
      {
        xPercent: 0,
      },
      {
        xPercent,
        ease: "none",
        duration: 10,
      },
      "<"
    );

    tlSlider.to(slider.current, {
      x: "-=150px",
      scrollTrigger: {
        trigger: slider.current,
        scrub: 0.25,
        start: "top 45%",
        end: "bottom 55%",
        markers: true,
        onUpdate: (self) => {
          const scrollDirection = self.direction === -1 ? 1 : -1;
          tlText.timeScale(scrollDirection);
          xPercent = xPercent === 100 ? -100 : 100;
          tlText.to(firstText.current, {
            xPercent: xPercent,
            ease: "none",
            duration: 10,
          });
          tlText.to(
            secondText.current,
            {
              xPercent: xPercent,
              ease: "none",
              duration: 10,
            },
            "<"
          );
        },
      },
    });
  }, []);

  return (
    <Box
      component="div"
      sx={{
        position: "relative",
        display: "flex",
        backgroundColor: "#f5f5f5",
        height: "20vh",
      }}
    >
      <Box
        ref={sliderText}
        component="div"
        sx={{
          position: "absolute",
          top: 0,
        }}
      >
        <Box
          ref={slider}
          component="div"
          sx={{
            position: "relative",
            whiteSpace: "nowrap",
          }}
        >
          <Box component="div" ref={firstText}>
            <Typography
              sx={{
                position: "relative",
                width: "max-content",
                paddingRight: "10px",
                margin: "0px",
                fontSize: "130px",
                fontWeight: "bold",
              }}
            >
              {Text}
            </Typography>
          </Box>
          <Box
            component="div"
            ref={secondText}
            sx={{
              position: "absolute",
              left: "100%",
              width: "max-content",
              top: 0,
              margin: "0px",
            }}
          >
            <Typography
              sx={{
                fontSize: "130px",
                fontWeight: "bold",
              }}
            >
              {Text}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
