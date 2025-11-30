import { Box, Link, Paper, Typography, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import NextLink from "next/link";
import { postService } from "../../../services/post.service";
import { useTheme } from "@mui/material/styles";

interface Props {
  hashtags?: string[];
}

export const HashtagsCard: FC<Props> = ({ hashtags: initialHashtags }) => {
  const t = useTranslations("Publication");
  const theme = useTheme();
  const [hashtags, setHashtags] = useState<string[]>(initialHashtags || []);
  const [isLoading, setIsLoading] = useState(!initialHashtags);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHashtags = async () => {
      if (initialHashtags) return; // Use provided hashtags if available
      
      setIsLoading(true);
      setError(false);
      try {
        const result = await postService.getPopularHashtags();
        if (result.data) {
          setHashtags(result.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching popular hashtags:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHashtags();
  }, [initialHashtags]);

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
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Popular
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      ) : error || hashtags.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hashtags available
        </Typography>
      ) : (
        <Box component="div" display="flex" flexDirection="column">
          {hashtags.map((hashtag, index) => (
            <NextLink
              key={index}
              href={`/hashtag/${encodeURIComponent(hashtag)}`}
              passHref
            >
              <Link
                py={1}
                component="span"
                sx={{
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                {`#${hashtag}`}
              </Link>
            </NextLink>
          ))}
        </Box>
      )}
    </Paper>
  );
};
