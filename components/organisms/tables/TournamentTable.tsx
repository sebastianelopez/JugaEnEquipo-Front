import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { SxProps, Theme } from "@mui/material";
import { FC } from "react";
import { Game } from "../../../interfaces";

interface Column {
  id: "type" | "name" | "registeredTeams" | "game";
  label?: string;
  minWidth?: number;
  align?: "right";
}

const columns: Column[] = [
  { id: "type", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "registeredTeams", label: "Teams", minWidth: 100 },
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
  }>;
  sx?: SxProps<Theme>;
}

export const TournamentTable: FC<TournamentData> = ({ tournaments, sx }) => {
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

  return (
    <Paper sx={{ width: "100%", ...(sx || {}) }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                Country
              </TableCell>
              <TableCell align="center" colSpan={3}>
                Details
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
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
                          {value.toLocaleString()}
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
