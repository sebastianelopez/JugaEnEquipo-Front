import { Button } from "@mui/material";
import { FC, useContext } from "react";
import { UserContext } from "../../context/user";
import { blizzardService } from "../../services/blizzard.service";

export const BlizzardButton: FC = () => {
  const { user } = useContext(UserContext);

  const handleConnect = () => {

    const state = Math.random().toString(36).substring(2, 15);

    localStorage.setItem("blizzard_auth_state", state);

    const authUrl = blizzardService.getAuthorizationUrl(state);
    window.location.href = authUrl;
  };

  return (
    <Button variant="contained" color="primary" onClick={handleConnect}>
      Connect Blizzard Account
    </Button>
  );
};
