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
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1.5, md: 2 }}
      sx={{ mb: { xs: 2, md: 4 } }}
    >
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: theme.palette.info.main,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              />
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
            fontSize: { xs: "0.875rem", md: "1rem" },
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
        size="small"
        startIcon={<AddIcon />}
        onClick={onOpenCreate}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          px: { xs: 2, sm: 3, md: 4 },
          height: { xs: "40px", sm: "40px" },
          borderRadius: 2,
          fontWeight: 600,
          fontSize: { xs: "0.875rem", md: "1rem" },
          minWidth: { xs: "100%", sm: "auto" },
          whiteSpace: "nowrap",
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
          transition: "all 0.2s ease-in-out",
          alignSelf: { xs: "stretch", sm: "auto" },
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0px)",
            boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`,
          },
          "& .MuiButton-startIcon": {
            marginRight: { xs: 0.5, md: 1 },
          },
        }}
      >
        {createLabel}
      </Button>
    </Stack>
  );
};

export default TournamentsHeader;
