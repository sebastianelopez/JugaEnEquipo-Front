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
  Checkbox,
  ListItemText,
  TextField,
} from "@mui/material";
import { GAMES_LIST } from "../../../constants/games";

interface Props {
  open: boolean;
  onClose: () => void;
  filters: {
    games: string[];
    types: ("Oficial" | "Amateur")[];
    modes: ("team" | "individual")[];
    organizer: string;
    regions: string[];
  };
  onChange: (filters: Props["filters"]) => void;
  labels?: {
    title?: string;
    game?: string;
    type?: string;
    mode?: string;
    organizer?: string;
    region?: string;
    clear?: string;
    apply?: string;
  };
  regionOptions?: string[];
}

export const TournamentFiltersDialog: FC<Props> = ({
  open,
  onClose,
  filters,
  onChange,
  labels,
  regionOptions = [],
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{labels?.title || "Filtros"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="filter-games-label">
              {labels?.game || "Juego"}
            </InputLabel>
            <Select
              labelId="filter-games-label"
              multiple
              value={filters.games}
              label={labels?.game || "Juego"}
              onChange={(e) =>
                onChange({ ...filters, games: e.target.value as string[] })
              }
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {GAMES_LIST.map((g) => (
                <MenuItem key={g.name} value={g.name}>
                  <Checkbox checked={filters.games.indexOf(g.name) > -1} />
                  <ListItemText primary={g.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="filter-region-label">
              {labels?.region || "Región"}
            </InputLabel>
            <Select
              labelId="filter-region-label"
              multiple
              value={filters.regions}
              label={labels?.region || "Región"}
              onChange={(e) =>
                onChange({ ...filters, regions: e.target.value as string[] })
              }
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {regionOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  <Checkbox checked={filters.regions.indexOf(r) > -1} />
                  <ListItemText primary={r} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="filter-type-label">
              {labels?.type || "Tipo"}
            </InputLabel>
            <Select
              labelId="filter-type-label"
              multiple
              value={filters.types}
              label={labels?.type || "Tipo"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  types: e.target.value as ("Oficial" | "Amateur")[],
                })
              }
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {(["Oficial", "Amateur"] as const).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  <Checkbox checked={filters.types.indexOf(opt) > -1} />
                  <ListItemText primary={opt} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="filter-mode-label">
              {labels?.mode || "Modo"}
            </InputLabel>
            <Select
              labelId="filter-mode-label"
              multiple
              value={filters.modes}
              label={labels?.mode || "Modo"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  modes: e.target.value as ("team" | "individual")[],
                })
              }
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {(["team", "individual"] as const).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  <Checkbox checked={filters.modes.indexOf(opt) > -1} />
                  <ListItemText
                    primary={opt === "team" ? "Equipos" : "Individual"}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={labels?.organizer || "Organizador"}
            value={filters.organizer}
            onChange={(e) =>
              onChange({ ...filters, organizer: e.target.value })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            onChange({
              games: [],
              types: [],
              modes: [],
              organizer: "",
              regions: [],
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
