import { FormLabel, Select } from "@mui/material";
import { ErrorMessage, useField } from "formik";

interface Props {
  label: string;
  name: string;
  [x: string]: any;
}

export const MySelect = ({ label, ...props }: Props) => {
  const [field] = useField(props);

  return (
    <>      
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <Select {...field} {...props} />
      <ErrorMessage name={props.name} component="span" />
    </>
  );
};
