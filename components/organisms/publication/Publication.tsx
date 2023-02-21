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
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
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
  media?: string;
};

interface Props {
  user: User;
  media: string;
  copy: string;
  comments: PublicationComment[];
  date: string;
}

export const Publication = ({ user, media, copy, comments, date }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const t = useTranslations("Publication");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe">
              <Image src={user.profileImage} width="400" height={"400"} />
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={user.name}
          subheader={date}
        />
        <CardMedia
          component="img"
          height="194"
          image={media}
          alt="Paella dish"
        />
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
          <Box>
          {comments &&
            comments.map(({comment, user, date, media}) => (
              <CardContent >
                <Typography variant="subtitle2">{user.name}</Typography>
                <Typography variant="body2">
                  {comment}
                </Typography>
                <Typography variant="caption" alignSelf={'end'}>
                  {date}
                </Typography>
              </CardContent>
            ))}
            </Box>
            <Box paddingX={2} paddingY={2}>
              <TextField fullWidth label={t("comment")} id="fullWidth" />
            </Box>
        </Collapse>
      </Card>
    </>
  );
};
