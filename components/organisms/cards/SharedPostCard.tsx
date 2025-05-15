import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Typography,
  ImageList,
  ImageListItem,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Post } from "../../../interfaces";
import Image from "next/image";

export const SharedPostCard = ({
  id,
  body,
  username,
  resources,
  urlProfileImage,
  createdAt,
}: Post) => {
  return (
    <Card
      key={`${id}-shared-post`}
      elevation={0}
      sx={{
        boxShadow: "inset 0px 0px 6px rgba(0, 0, 0, 0.15)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <CardActionArea>
        <CardHeader
          avatar={<Avatar src={urlProfileImage} alt="Profile Picture" />}
          title={username}
          subheader={createdAt}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {body}
          </Typography>

          {
            resources && resources.length > 0 ? (
              resources.length > 1 ? (
                // Case 1: Multiple resources - show ImageList
                <ImageList
                  sx={{ width: { xs: "100%", md: 500 }, maxHeight: 450 }}
                  cols={3}
                  rowHeight={164}
                >
                  {resources.map((mediaItem, index) => (
                    <ImageListItem key={index}>
                      <Image
                        src={mediaItem.url || ""}
                        alt={`Image ${index + 1}`}
                        width={164}
                        height={164}
                        style={{ borderRadius: "6px" }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : // Case 2: Single resource - show CardMedia
              resources[0]?.url ? (
                <CardMedia
                  image={resources[0].url}
                  sx={{
                    width: { xs: 350, sm: 425, md: 500 },
                    height: { xs: 315, sm: 383, md: 450 },
                    transition: "width 0.5s ease, height 0.5s ease",
                    marginTop: 5,
                    borderRadius: 1.5,
                  }}
                  title="Post image"
                />
              ) : null
            ) : null /* Case 3: No resources - show nothing */
          }
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
