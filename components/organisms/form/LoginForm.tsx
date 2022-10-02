import { Button } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MyCheckbox, MySelect, MyTextInput } from "../../atoms";


export const LoginForm= () => {
  return (    

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          terms: false,
          jobType: "",
        }}        
        onSubmit={(values) => {}}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, "Debe de tener 15 caracteres o menos")
            .required("Requerido"),
          lastName: Yup.string()
            .max(15, "Debe de tener 15 caracteres o menos")
            .required("Requerido"),
          email: Yup.string()
            .email("Email no tiene un formato valido")
            .required("Requerido"),
          terms: Yup.boolean()
            .oneOf([true], "Debe de aceptar las condiciones")
            .required("Requerido"),
          jobType: Yup.string().required("Requerido"),
        })}
      >
        {(formik) => (
          <Form
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '400px'
          }}
          >
            <MyTextInput
              label={"First Name"}
              name={"firstName"}
              placeholder="First name"
            />

            <MyTextInput
              label={"Last Name"}
              name={"lastName"}
              placeholder="Last name"
            />

            <MyTextInput
              label={"Email Adress"}
              name={"email"}
              type="text"
              placeholder="Email"
            />

            <MySelect name="jobType" as="select" label={"Job Type"}>
              <option value="">Pick something</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="it-senior">IT-Senior</option>
            </MySelect>

            <MyCheckbox label={"Terms and conditions"} name={"terms"} />

            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>    
  );
};
