import { Box, FormLabel } from "@mui/material";
import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ErrorMessage, useField, useFormikContext } from "formik";
import { FC } from "react";

interface Props {
  label: string;
  name: string;
  minDateTime?: Dayjs;
  whiteText?: boolean;
  [x: string]: any;
}

export const MyDateTimePicker: FC<
  Props & Omit<DateTimePickerProps<Dayjs>, "value" | "onChange" | "label">
> = ({ label, name, minDateTime, whiteText = false, ...props }) => {
  const [field, , helpers] = useField(name);
  const { submitCount } = useFormikContext<any>();

  const value = field.value ? dayjs(field.value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          marginBottom: "10px",
        }}
      >
        <FormLabel 
          htmlFor={name}
          sx={whiteText ? { color: "#fff" } : {}}
        >
          {label}
        </FormLabel>
        <DateTimePicker
          value={value}
          onChange={(newValue) => {
            helpers.setValue(newValue ? newValue.toISOString() : "");
          }}
          minDateTime={minDateTime}
          slotProps={{ 
            textField: { 
              size: "small",
              sx: whiteText ? {
                color: "#fff",
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.42)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.87)" },
                  "&.Mui-focused fieldset": { borderColor: "#fff" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiInputBase-input": {
                  color: "#fff",
                },
              } : {}
            } 
          }}
          {...props}
        />
        <ErrorMessage name={name} component="span" />
      </Box>
    </LocalizationProvider>
  );
};
