import { Avatar, Box, Link, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { FC } from "react";
import NextLink from "next/link";

interface Props {
  hashtags: string[];
}

export const HashtagsCard: FC<Props> = ({ hashtags }) => {
  const t = useTranslations("Publication");
  return (
    <Paper sx={{ p: 2, textAlign: "start", width: "100%", maxWidth: "250px" }}>
      <Typography variant="h5" fontWeight="bold">
        Popular
      </Typography>
      <Box component="div" display="flex" flexDirection="column">
        {hashtags.map((hashtag, index) => (
          <NextLink key={index} href={"/auth/register"} passHref>
            <Link py={1}>{`#${hashtag}`}</Link>
          </NextLink>
        ))}
      </Box>
    </Paper>
  );
};
