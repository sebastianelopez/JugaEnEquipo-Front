import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  ImageList,
  ImageListItem,
  CardActionArea,
} from "@mui/material";
import { Post } from "../../../interfaces";
import Image from "next/image";
import { formatTimeElapsed } from "../../../utils/formatTimeElapsed";

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
          subheader={formatTimeElapsed(new Date(createdAt))}
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
                        fill
                        style={{ borderRadius: "6px", objectFit: "cover" }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : // Case 2: Single resource - show CardMedia
              resources[0]?.url ? (
                resources[0].type === "video" ? (
                  <video
                    controls
                    src={resources[0].url}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      borderRadius: "12px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <img
                    src={resources[0].url}
                    alt="Post image"
                    style={{
                      width: "100%",
                      height: "100%",
                      transition: "width 0.5s ease, height 0.5s ease",
                      marginTop: 5,
                      borderRadius: 5,
                    }}
                  />
                )
              ) : null
            ) : null /* Case 3: No resources - show nothing */
          }
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
