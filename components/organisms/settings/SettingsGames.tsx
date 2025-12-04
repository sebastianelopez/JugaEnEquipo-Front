import {
  Typography,
  Divider,
  Button,
  Stack,
  Box,
  Paper,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FC, useCallback, useEffect, useState, useContext } from "react";
import { useTranslations } from "next-intl";
import { UserContext } from "../../../context/user";
import { gameService } from "../../../services/game.service";
import { playerService } from "../../../services/player.service";
import { rankService } from "../../../services/rank.service";
import { roleService } from "../../../services/role.service";
import { Game, Player, Rank, Role } from "../../../interfaces";
import { getGameImage } from "../../../utils/gameImageUtils";
import { getRankImageFromPlayer } from "../../../utils/rankImageUtils";
import Image from "next/image";
import { useFeedback } from "../../../hooks/useFeedback";
import { v4 as uuidv4 } from "uuid";

interface SettingsGamesProps {
  onSave?: () => void;
}

interface GameRequirements {
  region?: boolean;
  username?: boolean;
  tag?: boolean;
  steamId?: boolean;
}

interface PlayerFormData {
  gameId: string;
  gameRoleIds: string[];
  accountData: {
    region?: string;
    username?: string;
    tag?: string;
    steamId?: string;
  };
}

export const SettingsGames: FC<SettingsGamesProps> = ({ onSave }) => {
  const t = useTranslations("Settings");
  const { user } = useContext(UserContext);
  const { showError, showSuccess } = useFeedback();

  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameRequirements, setGameRequirements] = useState<GameRequirements>({});
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesData, setRolesData] = useState<Map<string, Role[]>>(new Map());
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<PlayerFormData>({
    gameId: "",
    gameRoleIds: [],
    accountData: {},
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PlayerFormData | "accountData", string>>>({});

  // Load games
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoadingGames(true);
        const result = await gameService.getAllGames();
        if (result.ok && result.data) {
          setGames(result.data);
        } else {
          showError({
            title: t("gamesLoadError"),
            message: (result as any).errorMessage || t("gamesLoadErrorMessage"),
          });
        }
      } catch (error) {
        showError({
          title: t("gamesLoadError"),
          message: t("gamesLoadErrorMessage"),
        });
      } finally {
        setLoadingGames(false);
      }
    };

    loadGames();
  }, [t, showError]);

  // Load user players
  useEffect(() => {
    const loadPlayers = async () => {
      if (!user?.id) return;

      try {
        setLoadingPlayers(true);
        const result = await playerService.search({ userId: user.id });
        if (result.ok && result.data) {
          setPlayers(result.data || []);
          
          // Load roles for each unique game
          const rolesMap = new Map<string, Role[]>();
          const uniqueGameIds = Array.from(new Set(result.data.map((p: Player) => p.gameId)));
          
          for (const gameId of uniqueGameIds) {
            if (!rolesMap.has(gameId)) {
              const rolesResult = await roleService.findAllByGame(gameId);
              if (rolesResult.ok && rolesResult.data) {
                rolesMap.set(gameId, rolesResult.data);
              }
            }
          }
          
          setRolesData(rolesMap);
        } else {
          // If search fails or returns empty, set empty array
          setPlayers([]);
        }
      } catch (error) {
        console.error("Error loading players:", error);
        setPlayers([]);
      } finally {
        setLoadingPlayers(false);
      }
    };

    loadPlayers();
  }, [user?.id]);

  // Load game requirements, ranks, and roles when game is selected
  useEffect(() => {
    const loadGameData = async () => {
      if (!formData.gameId) {
        setGameRequirements({});
        setRanks([]);
        setRoles([]);
        return;
      }

      try {
        setLoadingRequirements(true);
        const game = games.find((g) => g.id === formData.gameId);
        setSelectedGame(game || null);

        // Load requirements
        const requirementsResult = await gameService.getGameRequirements(formData.gameId);
        if (requirementsResult.ok && requirementsResult.data) {
          setGameRequirements(requirementsResult.data);
        }

        // Load ranks
        const ranksResult = await rankService.findAllByGame(formData.gameId);
        if (ranksResult.ok && ranksResult.data) {
          setRanks(ranksResult.data);
        }

        // Load roles
        const rolesResult = await roleService.findAllByGame(formData.gameId);
        if (rolesResult.ok && rolesResult.data) {
          setRoles(rolesResult.data);
          setRolesData((prev) => {
            const newMap = new Map(prev);
            newMap.set(formData.gameId, rolesResult.data);
            return newMap;
          });
        }
      } catch (error) {
        console.error("Error loading game data:", error);
      } finally {
        setLoadingRequirements(false);
      }
    };

    loadGameData();
  }, [formData.gameId, games]);

  const handleOpenDialog = useCallback((player?: Player) => {
    if (player) {
      setEditingPlayer(player);
      setFormData({
        gameId: player.gameId,
        gameRoleIds: player.gameRoleIds || [],
        accountData: player.accountData || {},
      });
    } else {
      setEditingPlayer(null);
      setFormData({
        gameId: "",
        gameRoleIds: [],
        accountData: {},
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingPlayer(null);
    setFormData({
      gameId: "",
      gameRoleIds: [],
      accountData: {},
    });
    setFormErrors({});
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof PlayerFormData | "accountData", string>> = {};

    if (!formData.gameId) {
      errors.gameId = t("gameRequired");
    }

    if (!formData.gameRoleIds || formData.gameRoleIds.length === 0) {
      errors.gameRoleIds = t("rolesRequired");
    }

    // Validate account data based on requirements
    if (gameRequirements.steamId && !formData.accountData.steamId) {
      errors.accountData = t("steamIdRequired");
    } else if (gameRequirements.username && !formData.accountData.username) {
      errors.accountData = t("usernameRequired");
    } else if (gameRequirements.region && !formData.accountData.region) {
      errors.accountData = t("regionRequired");
    } else if (gameRequirements.tag && !formData.accountData.tag) {
      errors.accountData = t("tagRequired");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, gameRequirements, t]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const playerId = editingPlayer?.id || uuidv4();
      const result = await playerService.create(formData, playerId);

      if (result.ok) {
        showSuccess({
          title: editingPlayer ? t("playerUpdated") : t("playerAdded"),
          message: editingPlayer ? t("playerUpdatedMessage") : t("playerAddedMessage"),
        });
        handleCloseDialog();
        onSave?.();
        // Reload players
        if (user?.id) {
          const playersResult = await playerService.search({ userId: user.id });
          if (playersResult.ok && playersResult.data) {
            setPlayers(playersResult.data || []);
          }
        }
      } else {
        showError({
          title: editingPlayer ? t("playerUpdateError") : t("playerAddError"),
          message: result.errorMessage || (editingPlayer ? t("playerUpdateErrorMessage") : t("playerAddErrorMessage")),
        });
      }
    } catch (error: any) {
      showError({
        title: editingPlayer ? t("playerUpdateError") : t("playerAddError"),
        message: error?.message || (editingPlayer ? t("playerUpdateErrorMessage") : t("playerAddErrorMessage")),
      });
    } finally {
      setSaving(false);
    }
  }, [formData, editingPlayer, validateForm, t, showError, showSuccess, handleCloseDialog, onSave]);

  const handleDelete = useCallback(async (playerId: string) => {
    if (!confirm(t("confirmDeletePlayer"))) {
      return;
    }

    try {
      const result = await playerService.delete(playerId);
      if (result.ok) {
        showSuccess({
          title: t("playerDeleted"),
          message: t("playerDeletedMessage"),
        });
        // Reload players
        if (user?.id) {
          const playersResult = await playerService.search({ userId: user.id });
          if (playersResult.ok && playersResult.data) {
            setPlayers(playersResult.data || []);
          }
        }
      } else {
        showError({
          title: t("playerDeleteError"),
          message: result.errorMessage || t("playerDeleteErrorMessage"),
        });
      }
    } catch (error: any) {
      showError({
        title: t("playerDeleteError"),
        message: error?.message || t("playerDeleteErrorMessage"),
      });
    }
  }, [t, showError, showSuccess]);

  const getPlayerRoles = useCallback((roleIds: string[], gameId: string) => {
    const gameRoles = rolesData.get(gameId) || [];
    return gameRoles.filter((r) => roleIds.includes(r.id));
  }, [rolesData]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t("gamesTitle")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t("addGame")}
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {loadingPlayers ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : players.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t("noGamesAdded")}
        </Alert>
      ) : (
        <Stack spacing={2}>
          {players.map((player) => {
            const playerRoles = getPlayerRoles(player.gameRoleIds || [], player.gameId);

            return (
              <Paper key={player.id} sx={{ p: 2, position: "relative" }}>
                {player.isOwnershipVerified === false && (
                  <Tooltip title={t("ownershipNotVerified") || "La propiedad de esta cuenta no está verificada"} arrow>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        opacity: 0.7,
                        "&:hover": {
                          opacity: 1,
                          color: "info.main",
                        },
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </Box>
                  </Tooltip>
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={player.gameName ? getGameImage(player.gameName) : undefined}
                    alt={player.gameName}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{player.gameName || t("unknownGame")}</Typography>
                    {player.gameRank && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5, mb: 0.5 }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            position: "relative",
                            flexShrink: 0,
                            border: `1px solid`,
                            borderColor: "divider",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={getRankImageFromPlayer(player.gameName, player.gameId, player.gameRank)}
                            alt={player.gameRank.name}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </Box>
                        <Chip
                          label={`${player.gameRank.name} (Level ${player.gameRank.level})`}
                          size="small"
                          color="secondary"
                        />
                      </Box>
                    )}
                    {playerRoles.length > 0 && (
                      <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                        {playerRoles.map((role) => (
                          <Chip key={role.id} label={role.roleName} size="small" />
                        ))}
                      </Box>
                    )}
                    {player.accountData?.username && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {t("username")}: {player.accountData.username}
                        {player.accountData.tag && `#${player.accountData.tag}`}
                        {player.accountData.region && ` (${player.accountData.region})`}
                      </Typography>
                    )}
                    {player.accountData?.steamId && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Steam ID: {player.accountData.steamId}
                      </Typography>
                    )}
                    {player.verified && (
                      <Chip
                        label="Verificado"
                        size="small"
                        color="success"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(player)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => player.id && handleDelete(player.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPlayer ? t("editGame") : t("addGame")}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth error={!!formErrors.gameId}>
              <InputLabel>{t("selectGame")}</InputLabel>
              <Select
                value={formData.gameId}
                onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                label={t("selectGame")}
                disabled={loadingGames || !!editingPlayer}
              >
                {games.map((game) => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.gameId && <FormHelperText>{formErrors.gameId}</FormHelperText>}
            </FormControl>

            {loadingRequirements && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            {formData.gameId && !loadingRequirements && (
              <>
                <FormControl fullWidth error={!!formErrors.gameRoleIds}>
                  <InputLabel>{t("selectRoles")}</InputLabel>
                  <Select
                    multiple
                    value={formData.gameRoleIds}
                    onChange={(e) =>
                      setFormData({ ...formData, gameRoleIds: e.target.value as string[] })
                    }
                    label={t("selectRoles")}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.gameRoleIds && <FormHelperText>{formErrors.gameRoleIds}</FormHelperText>}
                </FormControl>

                {gameRequirements.steamId && (
                  <TextField
                    fullWidth
                    label={t("steamId")}
                    value={formData.accountData.steamId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountData: { ...formData.accountData, steamId: e.target.value },
                      })
                    }
                    error={!!formErrors.accountData}
                    helperText={formErrors.accountData}
                    required
                  />
                )}

                {gameRequirements.username && (
                  <TextField
                    fullWidth
                    label={t("riotUsername")}
                    value={formData.accountData.username || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountData: { ...formData.accountData, username: e.target.value },
                      })
                    }
                    error={!!formErrors.accountData}
                    helperText={formErrors.accountData}
                    required
                  />
                )}

                {gameRequirements.tag && (
                  <TextField
                    fullWidth
                    label={t("riotTag")}
                    value={formData.accountData.tag || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountData: { ...formData.accountData, tag: e.target.value },
                      })
                    }
                    error={!!formErrors.accountData}
                    helperText={formErrors.accountData}
                    required
                  />
                )}

                {gameRequirements.region && (
                  <FormControl fullWidth>
                    <InputLabel>{t("riotRegion")}</InputLabel>
                    <Select
                      value={formData.accountData.region || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountData: { ...formData.accountData, region: e.target.value },
                        })
                      }
                      label={t("riotRegion")}
                      required
                    >
                      <MenuItem value="LAS">LAS</MenuItem>
                      <MenuItem value="LAN">LAN</MenuItem>
                      <MenuItem value="NA">NA</MenuItem>
                      <MenuItem value="EUW">EUW</MenuItem>
                      <MenuItem value="EUNE">EUNE</MenuItem>
                      <MenuItem value="BR">BR</MenuItem>
                      <MenuItem value="KR">KR</MenuItem>
                      <MenuItem value="JP">JP</MenuItem>
                      <MenuItem value="OCE">OCE</MenuItem>
                      <MenuItem value="RU">RU</MenuItem>
                      <MenuItem value="TR">TR</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : t("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

