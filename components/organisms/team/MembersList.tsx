import { FC, useState } from "react";
import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Box,
  alpha,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

interface Member {
  id: number | string;
  name: string;
  username: string;
  avatar: string;
  role?: string;
  position?: string;
  joinDate?: string;
  isCreator?: boolean;
  isLeader?: boolean;
}

interface Props {
  members: Member[];
  title: string;
  formatSince: (dateIso?: string) => string;
  currentUserId?: string;
  isCurrentUserLeader?: boolean;
  isCurrentUserCreator?: boolean;
  teamId?: string;
  onUpdateLeader?: (userId: string) => Promise<void>;
  onRemoveMember?: (userId: string) => Promise<void>;
  onMemberUpdated?: () => void;
}

export const MembersList: FC<Props> = ({
  members,
  title,
  formatSince,
  currentUserId,
  isCurrentUserLeader = false,
  isCurrentUserCreator = false,
  teamId,
  onUpdateLeader,
  onRemoveMember,
  onMemberUpdated,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations("TeamDetail");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "remove" | "leader" | null
  >(null);
  const [processing, setProcessing] = useState(false);

  const canManageMembers = isCurrentUserLeader || isCurrentUserCreator;
  const isCreator = isCurrentUserCreator;

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    member: Member
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const handleMakeLeader = () => {
    handleMenuClose();
    if (selectedMember) {
      setConfirmAction("leader");
      setConfirmDialogOpen(true);
    }
  };

  const handleRemoveMember = () => {
    handleMenuClose();
    if (selectedMember) {
      setConfirmAction("remove");
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedMember) return;

    try {
      setProcessing(true);
      if (confirmAction === "leader" && onUpdateLeader) {
        await onUpdateLeader(String(selectedMember.id));
      } else if (confirmAction === "remove" && onRemoveMember) {
        await onRemoveMember(String(selectedMember.id));
      }
      setConfirmDialogOpen(false);
      setConfirmAction(null);
      setSelectedMember(null);
      onMemberUpdated?.();
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleMemberClick = (memberId: string | number) => {
    router.push(`/profile/${members.find((m) => m.id === memberId)?.username}`);
  };

  const canPerformActionOnMember = (member: Member): boolean => {
    if (!canManageMembers) return false;
    // Can't remove yourself
    if (String(member.id) === currentUserId) return false;
    // Creator can't be removed or have leader changed
    if (member.isCreator) return false;
    // Can't remove current leader unless you're the creator
    if (member.isLeader && !isCreator) return false;
    return true;
  };

  if (members.length === 0) {
    return (
      <>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: { xs: 2, md: 3 } }}
        >
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 4 },
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
          }}
        >
          <PersonIcon
            sx={{
              fontSize: { xs: 48, md: 64 },
              color: theme.palette.text.secondary,
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            {t("noMembers")}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
          }}
        >
          {title}
        </Typography>
      </Stack>
      <List sx={{ p: 0 }}>
        {members.map((member, index) => {
          const canAction = canPerformActionOnMember(member);
          const isCurrentUser = String(member.id) === currentUserId;

          return (
            <ListItem
              key={member.id}
              sx={{
                bgcolor: theme.palette.background.default,
                borderRadius: { xs: 1.5, md: 2 },
                mb: { xs: 1.5, md: 2 },
                p: { xs: 1.5, sm: 2 },
                transition: "all 0.2s ease-in-out",
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  transform: "translateX(4px)",
                  boxShadow: `0 2px 8px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                },
              }}
              onClick={() => handleMemberClick(member.id)}
              secondaryAction={
                canAction ? (
                  <Tooltip title={t("options")}>
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuOpen(e, member)}
                      sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                ) : null
              }
            >
              <ListItemAvatar
                sx={{
                  minWidth: { xs: 56, sm: 64, md: 72 },
                  mr: { xs: 1.5, sm: 2 },
                }}
              >
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  sx={{
                    width: { xs: 56, sm: 64, md: 72 },
                    height: { xs: 56, sm: 64, md: 72 },
                    border: {
                      xs: `2px solid ${theme.palette.primary.main}`,
                      md: `3px solid ${theme.palette.primary.main}`,
                    },
                    boxShadow: `0 0 0 ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                disableTypography
                sx={{ flex: 1, minWidth: 0 }}
                primary={
                  <Stack
                    direction="row"
                    spacing={{ xs: 0.75, sm: 1 }}
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ mb: { xs: 0.5, sm: 0.75 } }}
                  >
                    <Typography
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                        fontSize: {
                          xs: "0.95rem",
                          sm: "1.05rem",
                          md: "1.1rem",
                        },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {member.name}
                    </Typography>
                    {member.role === "creator" && (
                      <Chip
                        icon={
                          <StarIcon
                            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                          />
                        }
                        label={t("creator")}
                        size="small"
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.getContrastText(
                            theme.palette.primary.main
                          ),
                          fontWeight: 600,
                          height: { xs: 22, sm: 24 },
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          "& .MuiChip-icon": {
                            marginLeft: { xs: "4px", md: "6px" },
                          },
                        }}
                      />
                    )}
                    {member.role === "leader" && (
                      <Chip
                        icon={
                          <StarIcon
                            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                          />
                        }
                        label={t("leader")}
                        size="small"
                        sx={{
                          bgcolor: theme.palette.warning.main,
                          color: theme.palette.getContrastText(
                            theme.palette.warning.main
                          ),
                          fontWeight: 600,
                          height: { xs: 22, sm: 24 },
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          "& .MuiChip-icon": {
                            marginLeft: { xs: "4px", md: "6px" },
                          },
                        }}
                      />
                    )}
                  </Stack>
                }
                secondary={
                  <Stack spacing={{ xs: 0.25, sm: 0.5 }} sx={{ mt: 0.5 }}>
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                        fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      @{member.username}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      {member.position && (
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.8rem",
                              md: "0.85rem",
                            },
                          }}
                        >
                          {member.position}
                        </Typography>
                      )}
                      {member.position && member.joinDate && (
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.8rem",
                              md: "0.85rem",
                            },
                          }}
                        >
                          •
                        </Typography>
                      )}
                      {member.joinDate && (
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.8rem",
                              md: "0.85rem",
                            },
                          }}
                        >
                          {formatSince(member.joinDate)}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                }
              />
            </ListItem>
          );
        })}
      </List>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {selectedMember && !selectedMember.isLeader && (
          <MenuItem onClick={handleMakeLeader} disabled={processing}>
            <HowToRegIcon sx={{ mr: 1, fontSize: 20 }} />
            {t("changeLeader")}
          </MenuItem>
        )}
        {selectedMember && !selectedMember.isCreator && (
          <MenuItem
            onClick={handleRemoveMember}
            disabled={processing}
            sx={{ color: theme.palette.error.main }}
          >
            <PersonRemoveIcon sx={{ mr: 1, fontSize: 20 }} />
            {t("removeMember")}
          </MenuItem>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => !processing && setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          {confirmAction === "leader"
            ? t("changeLeaderConfirmationTitle")
            : t("removeMemberConfirmationTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction === "leader"
              ? t("changeLeaderConfirmationMessage", {
                  memberName: selectedMember?.name || "",
                  teamName: title
                    .replace("Team Members (", "")
                    .replace(")", ""),
                })
              : t("removeMemberConfirmationMessage", {
                  memberName: selectedMember?.name || "",
                  teamName: title
                    .replace("Team Members (", "")
                    .replace(")", ""),
                })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            disabled={processing}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmAction === "remove" ? "error" : "primary"}
            variant="contained"
            disabled={processing}
          >
            {processing ? t("processing") : t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MembersList;
