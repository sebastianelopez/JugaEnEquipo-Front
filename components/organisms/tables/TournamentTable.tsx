import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, SxProps, Theme } from "@mui/material";
import { FC } from "react";
import { Game } from "../../../interfaces";
import { generateManyTournaments } from "./mocks";
import VerifiedIcon from "@mui/icons-material/Verified";

interface Column {
  id: "type" | "name" | "registeredTeams" | "game" | "region";
  label?: string;
  minWidth?: number;
  align?: "right";
}

const columns: Column[] = [
  { id: "type", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "registeredTeams", label: "Teams", minWidth: 100 },
  { id: "region", label: "Region", minWidth: 100 },
  {
    id: "game",
    label: "Game",
    minWidth: 170,
    align: "right",
  },
];

interface TournamentData {
  tournaments: Array<{
    type: "Oficial" | "Amateur";
    name: string;
    registeredTeams: number;
    maxTeams: number;
    game: Game;
    region: string;
  }>;
  sx?: SxProps<Theme>;
}

const MOCK_TOURNAMENTS = generateManyTournaments(100);

export const TournamentTable: FC<TournamentData> = ({ sx }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const tournaments = MOCK_TOURNAMENTS; // TODO: Replace with actual data source

  return (
    <Paper sx={{ width: "100%", ...(sx || {}) }}>
      <TableContainer sx={{ maxHeight: 750 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tournaments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((tournament) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={tournament.name}
                  >
                    {columns.map((column) => {
                      const value = tournament[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "type" && value === "Oficial" ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {value.toLocaleString()}{" "}
                              <VerifiedIcon color="primary" fontSize="small" />
                            </Box>
                          ) : column.id === "game" ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                justifyContent: "flex-end",
                              }}
                            >
                              <img
                                src={(value as Game).image}
                                alt={`${(value as Game).name} logo`}
                                style={{ width: 24, height: 24 }}
                              />
                              {(value as Game).name}
                            </Box>
                          ) : (
                            value.toLocaleString()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tournaments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
