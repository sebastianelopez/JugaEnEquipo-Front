import { FormLabel, Select } from "@mui/material";
import { ErrorMessage, useField } from "formik";

interface Props {
  label: string;
  name: string;
  whiteText?: boolean;
  [x: string]: any;
}

export const MySelect = ({ label, whiteText = false, ...props }: Props) => {
  const [field] = useField(props);

  return (
    <>      
      <FormLabel 
        htmlFor={props.id || props.name}
        sx={whiteText ? { color: "#fff" } : {}}
      >
        {label}
      </FormLabel>
      <Select 
        {...field} 
        {...props}
        sx={whiteText ? {
          color: "#fff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.42)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.87)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "& .MuiSelect-icon": {
            color: "#fff",
          },
        } : {}}
      />
      <ErrorMessage name={props.name} component="span" />
    </>
  );
};
