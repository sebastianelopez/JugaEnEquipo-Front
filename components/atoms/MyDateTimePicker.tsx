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
  [x: string]: any;
}

export const MyDateTimePicker: FC<
  Props & Omit<DateTimePickerProps<Dayjs>, "value" | "onChange" | "label">
> = ({ label, name, minDateTime, ...props }) => {
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
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <DateTimePicker
          value={value}
          onChange={(newValue) => {
            helpers.setValue(newValue ? newValue.toISOString() : "");
          }}
          minDateTime={minDateTime}
          slotProps={{ textField: { size: "small" } }}
          {...props}
        />
        <ErrorMessage name={name} component="span" />
      </Box>
    </LocalizationProvider>
  );
};
