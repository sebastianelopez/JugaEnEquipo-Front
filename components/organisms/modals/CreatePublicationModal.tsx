import {
  Avatar,
  Box,
  Button,
  Input,
  Modal,
  Paper,
  SxProps,
  Theme,
} from "@mui/material";
import { SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  sx?: SxProps<Theme>;
  open: boolean;
  onClose: (value: SetStateAction<boolean>) => void;
}

export const CreatePublicationModal = ({ sx = [], open, onClose }: Props) => {
  const t = useTranslations("Publication");

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={[{}, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <Box
          component="div"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            background: "white",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="modal-title">My Title</h2>
          <p id="modal-description">My Description</p>
        </Box>
      </Modal>
    </>
  );
};
