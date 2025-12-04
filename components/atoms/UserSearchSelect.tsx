import { FC, useState, useEffect, useRef } from "react";
import { useField, useFormikContext } from "formik";
import {
  TextField,
  Autocomplete,
  Box,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { backofficeService, type User } from "../../services/backoffice.service";

interface UserSearchSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const UserSearchSelect: FC<UserSearchSelectProps> = ({
  name,
  label,
  placeholder,
  required = false,
}) => {
  const [field, meta, helpers] = useField(name);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  // Load selected user when field value changes (from outside)
  useEffect(() => {
    if (field.value && (!selectedUser || selectedUser.id !== field.value)) {
      // Check if we already have this user in our list
      const foundUser = users.find((u) => u.id === field.value);
      if (foundUser) {
        setSelectedUser(foundUser);
        if (!searchTerm || searchTerm !== foundUser.username) {
          setSearchTerm(foundUser.username);
        }
      } else {
        // Try to load user by ID
        backofficeService
          .searchUsers({ limit: 100, offset: 0 })
          .then((result) => {
            if (result.ok && result.data) {
              const user = result.data.data?.find((u) => u.id === field.value);
              if (user) {
                setSelectedUser(user);
                setUsers((prev) => {
                  // Add to list if not already there
                  if (!prev.find((u) => u.id === user.id)) {
                    return [user, ...prev];
                  }
                  return prev;
                });
                setSearchTerm(user.username);
              }
            }
          })
          .catch(() => {
            // Ignore errors
          });
      }
    } else if (!field.value && selectedUser) {
      setSelectedUser(null);
      setSearchTerm("");
    }
  }, [field.value]);

  // Search users when searchTerm changes
  useEffect(() => {
    // Don't search if we're in the middle of selecting
    if (isSelectingRef.current) {
      return;
    }

    // Don't search if the searchTerm matches the selected user's username
    if (selectedUser && searchTerm === selectedUser.username) {
      return;
    }

    if (searchTerm.trim().length >= 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await backofficeService.searchUsers({
            username: searchTerm,
            limit: 10,
            offset: 0,
          });

          if (result.ok && result.data) {
            const newUsers = result.data.data || [];
            // If we have a selected user, make sure it's in the list
            if (selectedUser && !newUsers.find((u) => u.id === selectedUser.id)) {
              setUsers([selectedUser, ...newUsers]);
            } else {
              setUsers(newUsers);
            }
          } else {
            // Keep selected user in list even if search fails
            if (selectedUser) {
              setUsers([selectedUser]);
            } else {
              setUsers([]);
            }
          }
        } catch (error) {
          console.error("Error searching users:", error);
          if (selectedUser) {
            setUsers([selectedUser]);
          } else {
            setUsers([]);
          }
        } finally {
          setLoading(false);
        }
      }, 300);
    } else if (searchTerm.trim().length === 0 && !selectedUser) {
      setUsers([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      options={users}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : option.username ? `@${option.username}` : ""
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedUser}
      onChange={(_, newValue) => {
        isSelectingRef.current = true;
        if (newValue && typeof newValue !== "string") {
          setSelectedUser(newValue);
          helpers.setValue(newValue.id);
          // Update searchTerm to show selected user's username
          setSearchTerm(newValue.username);
          // Keep selected user in the list
          setUsers((prev) => {
            if (!prev.find((u) => u.id === newValue.id)) {
              return [newValue, ...prev];
            }
            return prev;
          });
        } else {
          setSelectedUser(null);
          helpers.setValue("");
          setSearchTerm("");
        }
        setTimeout(() => {
          isSelectingRef.current = false;
        }, 200);
      }}
      onInputChange={(_, newInputValue, reason) => {
        // When selecting a value, reason is "reset" - don't update searchTerm
        if (reason === "reset") {
          // Keep the current searchTerm (which should be the selected user's username)
          return;
        }
        // Only update when user is typing
        if (reason === "input" || reason === "clear") {
          setSearchTerm(newInputValue);
          // If clearing and we had a selected user, clear selection
          if (reason === "clear" && selectedUser) {
            setSelectedUser(null);
            helpers.setValue("");
          }
        }
      }}
      loading={loading}
      filterOptions={(x) => x} // Disable client-side filtering
      inputValue={searchTerm}
      onClose={() => {
        setOpen(false);
        // When closing, if we have a selected user, restore their username
        if (selectedUser && searchTerm !== selectedUser.username) {
          setSearchTerm(selectedUser.username);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <Person
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    mr: 1,
                    fontSize: 20,
                  }}
                />
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "#6C5CE7" },
              "&.Mui-focused fieldset": { borderColor: "#6C5CE7" },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiFormHelperText-root": {
              color: "rgba(255, 255, 255, 0.5)",
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 1.5,
            "&:hover": {
              backgroundColor: "rgba(108, 92, 231, 0.1)",
            },
          }}
        >
          <Avatar sx={{ bgcolor: "#6C5CE7", width: 32, height: 32 }}>
            {option.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              @{option.username}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.75rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {option.email}
            </Typography>
          </Box>
        </Box>
      )}
      sx={{
        "& .MuiAutocomplete-paper": {
          backgroundColor: "#2D3436",
          border: "1px solid rgba(108, 92, 231, 0.2)",
        },
      }}
    />
  );
};

