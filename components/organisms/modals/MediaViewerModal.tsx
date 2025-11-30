import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface MediaItem {
  url: string;
  type: string;
}

interface Props {
  sx?: SxProps<Theme>;
  open: boolean;
  onClose: (value: SetStateAction<boolean>) => void;
  allMedia?: MediaItem[];
  initialIndex?: number;
  ariaLabel?: string;
}

export const MediaViewerModal = ({
  sx = [],
  open,
  onClose,
  allMedia = [],
  initialIndex = 0,
  ariaLabel = "Media viewer modal",
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(
    allMedia[initialIndex]
  );

  const handlePrevious = () => {
    if (allMedia.length > 0) {
      const newIndex = (currentIndex - 1 + allMedia.length) % allMedia.length;
      setCurrentIndex(newIndex);
      setCurrentMedia(allMedia[newIndex]);
    }
  };

  const handleNext = () => {
    if (allMedia.length > 0) {
      const newIndex = (currentIndex + 1) % allMedia.length;
      setCurrentIndex(newIndex);
      setCurrentMedia(allMedia[newIndex]);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setCurrentMedia(allMedia[initialIndex]);
    }
  }, [open, initialIndex]);

  const hasMultipleItems = allMedia.length > 1;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-label={ariaLabel}
      sx={[...(Array.isArray(sx) ? sx : [sx]), { marginInline: 3 }]}
      maxWidth="lg"
      fullWidth
    >
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "black",
          position: "relative",
          height: "90vh",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            bgcolor: "rgba(0,0,0,0.3)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.5)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {hasMultipleItems && (
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              bgcolor: "rgba(0,0,0,0.3)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.5)",
              },
              zIndex: 2,
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}

        {currentMedia?.type === "video" ? (
          <video
            controls
            src={currentMedia.url}
            autoPlay
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            src={currentMedia?.url}
            alt="Full size media"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        )}

        {/* Next button */}
        {hasMultipleItems && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              bgcolor: "rgba(0,0,0,0.3)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.5)",
              },
              zIndex: 2,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}

        {/* Optional: Image counter indicator */}
        {hasMultipleItems && (
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontSize: 14,
            }}
          >
            {currentIndex + 1} / {allMedia.length}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
