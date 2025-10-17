import { FC } from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTheme, alpha } from "@mui/material/styles";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onOpenFilters: () => void;
  placeholder: string;
  createLabel: string;
  filtersTooltip: string;
}

export const TournamentsHeader: FC<Props> = ({
  searchQuery,
  onSearchChange,
  onOpenCreate,
  onOpenFilters,
  placeholder,
  createLabel,
  filtersTooltip,
}) => {
  const theme = useTheme();
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.info.main }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={filtersTooltip}>
                <IconButton onClick={onOpenFilters} edge="end" size="small">
                  <FilterListIcon sx={{ color: theme.palette.info.main }} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
          sx: {
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.divider, 0.6),
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.info.main,
            },
          },
        }}
      />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onOpenCreate}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          minWidth: { xs: "100%", sm: "200px" },
          "&:hover": { bgcolor: theme.palette.primary.dark },
        }}
      >
        {createLabel}
      </Button>
    </Stack>
  );
};

export default TournamentsHeader;
