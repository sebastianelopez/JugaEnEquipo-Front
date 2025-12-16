import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type { Tournament, Team } from "../../../interfaces";

interface TournamentDialogsProps {
  deleteTournamentDialogOpen: boolean;
  deletingTournament: boolean;
  tournament: Tournament | null;
  onCancelDeleteTournament: () => void;
  onConfirmDeleteTournament: () => void;

  removeTeamDialogOpen: boolean;
  removingTeam: boolean;
  teamToRemove: Team | null;
  onCancelRemoveTeam: () => void;
  onConfirmRemoveTeam: () => void;

  leaveTeamDialogOpen: boolean;
  leaving: boolean;
  userRegisteredTeams: Team[];
  selectedLeaveTeamId: string;
  onCancelLeaveTeam: () => void;
  onConfirmLeaveTeam: () => void;
  onSelectLeaveTeam: (teamId: string) => void;
}

export const TournamentDialogs = ({
  deleteTournamentDialogOpen,
  deletingTournament,
  tournament,
  onCancelDeleteTournament,
  onConfirmDeleteTournament,
  removeTeamDialogOpen,
  removingTeam,
  teamToRemove,
  onCancelRemoveTeam,
  onConfirmRemoveTeam,
  leaveTeamDialogOpen,
  leaving,
  userRegisteredTeams,
  selectedLeaveTeamId,
  onCancelLeaveTeam,
  onConfirmLeaveTeam,
  onSelectLeaveTeam,
}: TournamentDialogsProps) => {
  const t = useTranslations("Tournaments");

  return (
    <>
      {/* Delete Tournament Confirmation Dialog */}
      <Dialog
        open={deleteTournamentDialogOpen}
        onClose={() =>
          !deletingTournament && onCancelDeleteTournament()
        }
        aria-labelledby="delete-tournament-dialog-title"
        aria-describedby="delete-tournament-dialog-description"
      >
        <DialogTitle id="delete-tournament-dialog-title">
          {t("detail.deleteTournamentTitle") || "Eliminar Torneo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-tournament-dialog-description">
            {t("detail.deleteTournamentConfirmation", {
              tournamentName: tournament?.name || "",
            }) ||
              `¿Estás seguro de que deseas eliminar el torneo "${
                tournament?.name || ""
              }"? Esta acción no se puede deshacer.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onCancelDeleteTournament}
            variant="outlined"
            disabled={deletingTournament}
          >
            {t("detail.cancel")}
          </Button>
          <Button
            onClick={onConfirmDeleteTournament}
            color="error"
            variant="contained"
            disabled={deletingTournament}
            autoFocus
          >
            {deletingTournament
              ? t("detail.deletingTournament") || "Eliminando..."
              : t("detail.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Team Confirmation Dialog */}
      <Dialog
        open={removeTeamDialogOpen}
        onClose={() => !removingTeam && onCancelRemoveTeam()}
        aria-labelledby="remove-team-dialog-title"
        aria-describedby="remove-team-dialog-description"
      >
        <DialogTitle id="remove-team-dialog-title">
          {t("detail.removeTeamTitle") || "Remover Equipo del Torneo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-team-dialog-description">
            {t("detail.removeTeamConfirmation", {
              teamName: teamToRemove?.name ?? "",
            }) ||
              `¿Estás seguro de que deseas remover el equipo "${
                teamToRemove?.name ?? ""
              }" del torneo?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onCancelRemoveTeam}
            variant="outlined"
            disabled={removingTeam}
          >
            {t("detail.cancel")}
          </Button>
          <Button
            onClick={onConfirmRemoveTeam}
            color="error"
            variant="contained"
            disabled={removingTeam}
            autoFocus
          >
            {removingTeam
              ? t("detail.removingTeam") || "Removiendo..."
              : t("detail.removeTeam") || "Remover"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Select Team to Leave Tournament Dialog */}
      <Dialog
        open={leaveTeamDialogOpen}
        onClose={onCancelLeaveTeam}
        aria-labelledby="leave-team-dialog-title"
        aria-describedby="leave-team-dialog-description"
      >
        <DialogTitle id="leave-team-dialog-title">
          {t("detail.selectTeamToLeave") ||
            "Seleccionar Equipo para Dejar el Torneo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="leave-team-dialog-description" sx={{ mb: 2 }}>
            {t("detail.selectTeamToLeaveDescription") ||
              "Tienes múltiples equipos registrados en este torneo. Selecciona cuál equipo deseas que deje el torneo:"}
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>{t("detail.selectTeam") || "Equipo"}</InputLabel>
            <Select
              value={selectedLeaveTeamId}
              onChange={(e) => onSelectLeaveTeam(e.target.value)}
              label={t("detail.selectTeam") || "Equipo"}
              disabled={leaving}
            >
              {userRegisteredTeams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onCancelLeaveTeam}
            variant="outlined"
            disabled={leaving}
          >
            {t("detail.cancel")}
          </Button>
          <Button
            onClick={onConfirmLeaveTeam}
            color="error"
            variant="contained"
            disabled={leaving || !selectedLeaveTeamId}
            autoFocus
          >
            {leaving
              ? t("detail.leaving") || "Dejando..."
              : t("detail.leaveTournament") || "Dejar Torneo"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

