import Router from 'next/router';
import { ReactElement, useState } from 'react';
import {
  Card,
  Grid,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import useSWR from 'swr';
// custom components
import DropZone from 'components/DropZone';
import FlexBox from 'components/flex-box/FlexBox';
import getHeaderLink from 'components/getHeaderLink';
import DeliveryBox from 'components/icons/DeliveryBox';
// layout
import { NextPageWithLayout } from '../../_app';
import DashboardPageHeader from 'components/DashboardPageHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard/Layout';
// utils function for show error message
import getErrorMessage from 'utils/getErrorMessage';
// data types for typescript
import { Category, Product } from '__types__/common';
import UploadImage from '__types__/uploadImage';
import UploadImageBox from 'components/products/UploadImageBox';

const checkoutSchema = yup.object().shape({
  name: yup.string().required('Ingresa nombre y apellido'),
  phone: yup.string().required('Ingresa número de télefono'),
  email: yup.string().required('Ingresa correo electrónico'),
  quantity: yup.number().required('Ingresa cantidad de lentes'),
  price: yup.number().required('required'),
  products: yup.array().min(1).required('required'),
  cristals: yup.array().min(1).required('required'),
  graduations: yup.array().min(1).required('required'),
});

const AddNewRecipe: NextPageWithLayout = () => {
  const [files, setFiles] = useState<UploadImage[]>([]);
  const [loadingButton, setLoadingButton] = useState(false);

  // GET THE ALL PRODUCT CATEGORIES
  const { data: products = [] } = useSWR<Product[]>('/api/products');

  const initialValues = {
    name: '',
    phone: '',
    email: '',
    quantity: '',
    price: '',
    discount: 0,
    addition: '',
    products: [],
    cristals: [],
    graduations: [],
    image: ''
  };

  const handleFormSubmit = async (values: typeof initialValues) => {

    if (files.length === 0) return alert('Product Image is Required!');

    setLoadingButton(true);

    const formData = new FormData();
    formData.append('customerName', values.name);
    formData.append('phone', values.phone);
    formData.append('email', values.email);
    formData.append('quantity', values.quantity);
    formData.append('price', values.price);
    formData.append('discount', String(values.discount));
    formData.append('addition', values.addition);
    formData.append('products', JSON.stringify(values.products));
    formData.append('cristals', JSON.stringify(values.cristals));
    formData.append('graduations', JSON.stringify(values.graduations));

    files.forEach((file) => formData.append('files', file));

    try {
      const { data } = await axios.post('/api/recipe-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(`Receta creada exitosamente ${data._id}`);
      Router.push('/admin/recipes');
      setLoadingButton(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLoadingButton(false);
    }
  };

  const handleFileDelete = (file: File) => {
    setFiles((files) => files.filter((item) => item.name !== file.name));
  };

  const handleDropzone = (files: File[]) => {
    const uploadFiles = files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );

    setFiles(uploadFiles);
  };

  return (
    <Card sx={{ p: '30px' }}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form
            onSubmit={handleSubmit}
            method="post"
            encType="multipart/form-data"
          >
            <Grid container spacing={3}>
              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Nombre y apellido"
                  placeholder="Nombre y apellido"
                  onBlur={handleBlur}
                  value={values.name}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={(touched.name && errors.name) as string}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Teléfono contacto"
                  placeholder="Teléfono contacto"
                  onBlur={handleBlur}
                  value={values.phone}
                  onChange={handleChange}
                  error={!!touched.phone && !!errors.phone}
                  helperText={(touched.phone && errors.phone) as string}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  placeholder="Email"
                  onBlur={handleBlur}
                  value={values.email}
                  onChange={handleChange}
                  error={!!touched.email && !!errors.email}
                  helperText={(touched.email && errors.email) as string}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="cristals">Selecciona cristales</InputLabel>
                  <Select
                    multiple
                    name="cristals"
                    labelId="cristals"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cristals}
                    input={<OutlinedInput label="Selecciona cristal" />}
                    error={!!touched.cristals && !!errors.cristals}
                  >
                    {products.map((item) => (
                      <MenuItem value={item.item} key={item._id}>
                        {item.item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="graduations">Selecciona graduación</InputLabel>
                  <Select
                    multiple
                    name="graduations"
                    labelId="graduations"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.graduations}
                    input={<OutlinedInput label="Selecciona graduación" />}
                    error={!!touched.graduations && !!errors.graduations}
                  >
                    {products.map((item) => (
                      <MenuItem value={item.item} key={item._id}>
                        {item.item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="products">Selecciona lentes</InputLabel>
                  <Select
                    multiple
                    name="products"
                    labelId="products"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.products}
                    input={<OutlinedInput label="Selecciona lente" />}
                    error={!!touched.products && !!errors.products}
                  >
                    {products.map((item) => (
                      <MenuItem value={item.item} key={item._id}>
                        {item.item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <DropZone onChange={(files) => handleDropzone(files)} title='Arrastre y suelte la imagen de la receta aquí' imageSize='' />

                <FormHelperText error={!!touched.image && !!errors.image}>
                  {(touched.image && errors.image) as string}
                </FormHelperText>

                <FlexBox flexDirection="row" flexWrap="wrap" mt={1} gap={1}>
                  {files.map((file, index) => (
                    <UploadImageBox
                      key={index}
                      image={file.preview}
                      handleClear={() => handleFileDelete(file)}
                    />
                  ))}
                </FlexBox>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  rows={2}
                  multiline
                  fullWidth
                  name="addition"
                  label="Adición"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Adición"
                  value={values.addition}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Cantidad"
                  type="number"
                  placeholder="Cantidad"
                  onBlur={handleBlur}
                  value={values.quantity}
                  onChange={handleChange}
                  error={!!touched.quantity && !!errors.quantity}
                  helperText={(touched.quantity && errors.quantity) as string}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="price"
                  type="number"
                  onBlur={handleBlur}
                  label="Regular Price"
                  value={values.price}
                  onChange={handleChange}
                  placeholder="Regular Price"
                  error={!!touched.price && !!errors.price}
                  helperText={(touched.price && errors.price) as string}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  name="discount"
                  label="Discount %"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.discount}
                  placeholder="10"
                />
              </Grid>

              <Grid item xs={12}>
                <LoadingButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  loading={loadingButton}
                >
                  Guardar receta
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

// ==================================================================
AddNewRecipe.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminDashboardLayout>
      <DashboardPageHeader
        title="Agregar receta"
        Icon={DeliveryBox}
        button={getHeaderLink('/admin/recipes', 'Volver a la lista de recetas')}
      />

      {page}
    </AdminDashboardLayout>
  );
};
// ==================================================================

export default AddNewRecipe;
