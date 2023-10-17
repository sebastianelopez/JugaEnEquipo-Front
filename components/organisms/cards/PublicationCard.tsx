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
  Input,
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
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LikeButton } from "../../atoms";

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

export const PublicationCard = ({
  user,
  media,
  copy,
  comments,
  date,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  const t = useTranslations("Publication");

  const inputRef = useRef<HTMLInputElement>();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentClick = () => {
    setExpanded(true);   
      inputRef.current?.focus();    
    
    console.log(inputRef.current)
  };

  return (
    <>
      <Card
        sx={{
          width: { xs: "100%", md: 530 },
          transition: "width 0.5s ease, height 0.5s ease",
        }}
      >
        <CardHeader
          avatar={<Avatar src={user.profileImage} alt="Profile Picture" />}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={user.name}
          subheader={date}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {copy}
          </Typography>
          {media.length > 1 ? (
            <ImageList
              sx={{ width: { xs: "100%", md: 500 }, maxHeight: 450 }}
              cols={3}
              rowHeight={164}
            >
              {media.map((mediaItem, index) => (
                <ImageListItem key={index}>
                  <img
                    key={mediaItem}
                    src={`${mediaItem}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${mediaItem}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={"image"}
                    loading="lazy"
                    style={{ borderRadius: "6px" }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <CardMedia
              image={media[0]}
              sx={{
                width: { xs: 350, sm: 425, md: 500 },
                height: { xs: 315, sm: 383, md: 450 },
                transition: "width 0.5s ease, height 0.5s ease",
                marginTop: 5,
                borderRadius: 1.5,
              }}
              title="Paella dish"
            />
          )}
        </CardContent>

        <CardActions disableSpacing>
          <IconButton aria-label="like" onClick={handleCommentClick}>
            <AddCommentRoundedIcon />
          </IconButton>
          <LikeButton />
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
          <Box
            component={"div"}
            sx={{
              transition: "opacity 0.5s ease-out",
              opacity: expanded ? 1 : 0,
            }}
          >
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
              <Input fullWidth placeholder={t("comment")} inputRef={inputRef} />
            </Box>
          </Box>
        </Collapse>
      </Card>
    </>
  );
};
