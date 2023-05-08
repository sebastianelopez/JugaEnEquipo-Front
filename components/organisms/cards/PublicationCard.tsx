import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  IconButtonProps,
  ImageList,
  ImageListItem,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { User } from "../../../interfaces";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

type PublicationComment = {
  user: User;
  date: string;
  comment: string;
  media?: string[];
};

interface Props {
  user: User;
  media: string[];
  copy: string;
  comments: PublicationComment[];
  date: string;
}

export const PublicationCard = ({ user, media, copy, comments, date }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const t = useTranslations("Publication");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card sx={{  }}>
        <CardHeader
          avatar={
            <Avatar src={user.profileImage}  alt="Profile Picture" /> 
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={user.name}
          subheader={date}
        />
        {media.length > 1 ? (
          <ImageList
            sx={{ width: 500, maxHeight: 450 }}
            cols={3}
            rowHeight={164}
          >
            {media.map((mediaItem, index) => (
              <ImageListItem key={index}>
                <img
                  src={`${mediaItem}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${mediaItem}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={"image"}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <CardMedia
            component="img"
            height="194"
            image={media[0]}
            alt="Paella dish"
          />
        )}

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {copy}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="like">
            <AddCommentRoundedIcon />
          </IconButton>
          <IconButton aria-label="like">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box component={"div"}>
            {comments &&
              comments.map(({ comment, user, date, media }) => (
                <CardContent>
                  <Typography variant="subtitle2">{user.nickname}</Typography>
                  <Typography variant="body2">{comment}</Typography>
                  <Typography variant="caption" alignSelf={"end"}>
                    {date}
                  </Typography>
                </CardContent>
              ))}
          </Box>
          <Box paddingX={2} paddingY={2} component={"div"}>
            <TextField fullWidth label={t("comment")} id="fullWidth" />
          </Box>
        </Collapse>
      </Card>
    </>
  );
};
