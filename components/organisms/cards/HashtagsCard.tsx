import { Avatar, Box, Link, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { FC } from "react";
import NextLink from "next/link";
import { ComingSoon } from "../../atoms/ComingSoon";

interface Props {
  hashtags: string[];
}

export const HashtagsCard: FC<Props> = ({ hashtags }) => {
  const t = useTranslations("Publication");
  return (
    <Paper
      sx={{
        p: 2,
        textAlign: "start",
        width: "100%",
        maxWidth: "250px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          opacity: 0.6,
          filter: "grayscale(20%)",
          pointerEvents: "none",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ opacity: 0.8 }}>
          Popular
        </Typography>
        <Box component="div" display="flex" flexDirection="column">
          {hashtags.map((hashtag, index) => (
            <NextLink key={index} href={"/auth/register"} passHref>
              <Link
                py={1}
                component="span"
                sx={{
                  opacity: 0.7,
                  cursor: "not-allowed",
                  pointerEvents: "none",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "none",
                    opacity: 0.7,
                  },
                }}
              >
                {`#${hashtag}`}
              </Link>
            </NextLink>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: 2, opacity: 1, filter: "none", pointerEvents: "auto" }}>
        <ComingSoon variant="minimal" />
      </Box>
    </Paper>
  );
};
