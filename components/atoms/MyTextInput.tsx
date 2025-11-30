import { Box, FormLabel, Input } from "@mui/material";
import { ErrorMessage, useField, useFormikContext } from "formik";

interface Props {
  label: string;
  name: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "datetime-local";
  placeholder?: string;
  onlyShowRequiredError?: boolean;
  [x: string]: any;
}

export const MyTextInput = ({
  label,
  onlyShowRequiredError,
  ...props
}: Props) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext<any>();

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        marginBottom: "10px",
      }}
    >
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>

      <Input {...field} {...props} />
      <ErrorMessage name={props.name}>
        {(msg) => {
          const isEmpty = !field.value;
          const shouldShow = onlyShowRequiredError
            ? isEmpty && submitCount > 0
            : meta.touched || submitCount > 0;
          return shouldShow ? (
            <span
              style={{
                color: "#d32f2f",
                fontSize: "0.75rem",
                display: "block",
              }}
            >
              {msg}
            </span>
          ) : null;
        }}
      </ErrorMessage>
    </Box>
  );
};
