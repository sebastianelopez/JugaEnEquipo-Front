import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Game } from "../../../interfaces";

interface Props {
  open: boolean;
  onClose: () => void;
  filters: {
    gameId?: string;
    statusId?: string;
    mine?: boolean;
    open?: boolean;
  };
  onChange: (filters: Props["filters"]) => void;
  games?: Game[];
  labels?: {
    title?: string;
    game?: string;
    clear?: string;
    apply?: string;
  };
}

export const TournamentFiltersDialog: FC<Props> = ({
  open,
  onClose,
  filters,
  onChange,
  games = [],
  labels,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", md: "center" },
        },
      }}
      PaperProps={{
        sx: {
          m: { xs: 0, md: 2 },
          borderRadius: { xs: "16px 16px 0 0", md: 2 },
          maxHeight: { xs: "90vh", md: "90vh" },
          height: { xs: "auto", md: "auto" },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: { xs: 1, md: 2 },
          fontSize: { xs: "1.1rem", md: "1.25rem" },
        }}
      >
        {labels?.title || "Filtros"}
        {isMobile && (
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent 
        dividers
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ mt: { xs: 0, md: 1 } }}>
          <FormControl fullWidth>
            <InputLabel id="filter-game-label">
              {labels?.game || "Juego"}
            </InputLabel>
            <Select
              labelId="filter-game-label"
              value={filters.gameId || ""}
              label={labels?.game || "Juego"}
              onChange={(e) =>
                onChange({ ...filters, gameId: e.target.value || undefined })
              }
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              {games.map((game) => (
                <MenuItem key={game.id} value={game.id}>
                  {game.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={filters.mine || false}
                onChange={(e) =>
                  onChange({ ...filters, mine: e.target.checked })
                }
              />
            }
            label="Mis torneos"
          />

          <FormControl fullWidth>
            <InputLabel id="filter-open-label">Estado</InputLabel>
            <Select
              labelId="filter-open-label"
              value={
                filters.open === undefined
                  ? "all"
                  : filters.open
                  ? "open"
                  : "closed"
              }
              label="Estado"
              onChange={(e) => {
                const value = e.target.value;
                onChange({
                  ...filters,
                  open: value === "all" ? undefined : value === "open",
                });
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="open">Abiertos</MenuItem>
              <MenuItem value="closed">Cerrados</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 1.5 },
          flexDirection: { xs: "column-reverse", md: "row" },
          gap: { xs: 1, md: 0 },
          borderTop: { xs: `1px solid ${theme.palette.divider}`, md: "none" },
        }}
      >
        <Button
          onClick={() =>
            onChange({
              gameId: undefined,
              statusId: undefined,
              mine: false,
              open: undefined,
            })
          }
          color="inherit"
          fullWidth={isMobile}
          sx={{
            fontSize: { xs: "0.875rem", md: "1rem" },
            py: { xs: 1.25, md: 0.75 },
          }}
        >
          {labels?.clear || "Limpiar"}
        </Button>
        <Button 
          onClick={onClose} 
          variant="contained"
          fullWidth={isMobile}
          sx={{
            fontSize: { xs: "0.875rem", md: "1rem" },
            py: { xs: 1.25, md: 0.75 },
          }}
        >
          {labels?.apply || "Aplicar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TournamentFiltersDialog;
