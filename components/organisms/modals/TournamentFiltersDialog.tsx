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
} from "@mui/material";
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
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{labels?.title || "Filtros"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
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
      <DialogActions>
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
        >
          {labels?.clear || "Limpiar"}
        </Button>
        <Button onClick={onClose} variant="contained">
          {labels?.apply || "Aplicar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TournamentFiltersDialog;
