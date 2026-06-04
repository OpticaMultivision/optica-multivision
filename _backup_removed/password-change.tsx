import { ReactElement, useState } from "react";
import { signOut } from "next-auth/react";
import Lock from "@mui/icons-material/Lock";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField, Grid } from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import { Formik } from "formik";
import toast from "react-hot-toast";
// custom components
import Card1 from "components/Card1";
import DashboardPageHeader from "components/DashboardPageHeader";
// layout
import { NextPageWithLayout } from "./_app";
import UserDashboardLayout from "components/layouts/user-dashboard/Layout";
// utils function for error message
import getErrorMessage from "utils/getErrorMessage";

const PasswordChange: NextPageWithLayout = () => {
  const [loadingButton, setLoadingButton] = useState(false);

  const initialValues = {
    new_password: "",
    current_password: "",
    confirm_new_password: "",
  };

  const checkoutSchema = yup.object().shape({
    new_password: yup.string().required("Ingresa tu nueva contraseña"),
    current_password: yup
      .string()
      .required("Ingresa tu contraseña actual")
      .min(6, "Debe tener como mínimo 6 carácteres"),
    confirm_new_password: yup
      .string()
      .test("password-should-match", "Las contraseñas deben coincidir", function (value) {
        return this.parent.new_password === value;
      }),
  });

  const handleFormSubmit = async (values: typeof initialValues) => {
    setLoadingButton(true);

    const { new_password, current_password } = values;

    try {
      await axios.post(`/api/users/password_change`, { new_password, current_password });
      toast.success(`Password Updated Successfully!`);
      setLoadingButton(false);
      signOut();
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLoadingButton(false);
    }
  };

  return (
    <Card1>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item md={8} xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="current_password"
                  label="Contraseña actual"
                  value={values.current_password}
                  error={!!touched.current_password && !!errors.current_password}
                  helperText={(touched.current_password && errors.current_password) as string}
                />
              </Grid>

              <Grid item md={8} xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  onBlur={handleBlur}
                  name="new_password"
                  label="Nueva contraseña"
                  onChange={handleChange}
                  value={values.new_password}
                  error={!!touched.new_password && !!errors.new_password}
                  helperText={(touched.new_password && errors.new_password) as string}
                />
              </Grid>

              <Grid item md={8} xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Confirmar nueva contraseña"
                  name="confirm_new_password"
                  value={values.confirm_new_password}
                  error={!!touched.confirm_new_password && !!errors.confirm_new_password}
                  helperText={
                    (touched.confirm_new_password && errors.confirm_new_password) as string
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <LoadingButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  loading={loadingButton}
                >
                  Guardar cambios
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card1>
  );
};

// =================================================================
PasswordChange.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserDashboardLayout>
      <DashboardPageHeader Icon={Lock} title="Cambiar contraseña" />
      {page}
    </UserDashboardLayout>
  );
};
// =================================================================

export default PasswordChange;
