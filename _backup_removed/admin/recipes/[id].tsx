import { useRouter } from 'next/router';
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
import Loading from 'components/Loading';
import DropZone from 'components/DropZone';
import FlexBox from 'components/flex-box/FlexBox';
import getHeaderLink from 'components/getHeaderLink';
import DeliveryBox from 'components/icons/DeliveryBox';
import UploadImageBox from 'components/products/UploadImageBox';
// layout
import { NextPageWithLayout } from '../../_app';
import DashboardPageHeader from 'components/DashboardPageHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard/Layout';
// utils function for show error message
import getErrorMessage from 'utils/getErrorMessage';
// data type for typescript
import UploadImage from '__types__/uploadImage';
import { Product, Recipe } from '__types__/common';

// ==============================================================
type ProductImage = { key: string; location: string };
// ==============================================================

const RecipeDetails: NextPageWithLayout = () => {
  const { query, push } = useRouter();
  const [files, setFiles] = useState<UploadImage[]>([]);
  const [loadingBtn, setLoadingButton] = useState(false);
  const [deletedImage, setDeletedImage] = useState<any[]>([]);
  const [existingImage, setExistingImage] = useState<ProductImage[]>([]);

  // GET THE ALL PRODUCT CATEGORIES
  const { data: products = [] } = useSWR<Product[]>('/api/products');

  // GET PRODUCT DETAILS
  const {
    data: recipe,
    isLoading,
    mutate,
  } = useSWR<Recipe>(`/api/recipes/${query.id}`, null, {
    onSuccess(data) {
      setExistingImage(data.recipeDetails.image);
    },
  });

  const initialValues = {
    name: recipe?.customerName ?? '',
    phone: recipe?.customerContactInformation.phone ?? '',
    email: recipe?.customerContactInformation.email ?? '',
    quantity: recipe?.recipeDetails.quantity ?? 0,
    price: recipe?.recipeDetails.price.base ?? 0,
    discount: recipe?.recipeDetails.price.discount ?? 0,
    addition: recipe?.addition ?? '',
    products: recipe?.products ?? [],
    cristals: recipe?.cristals ?? [],
    graduations: recipe?.graduations ?? [],
  };

  // FORM FIELD VALIDATE SCHEMA
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

  // HANDLE FORM SUBMIT
  const handleFormSubmit = async (values: typeof initialValues) => {
    setLoadingButton(true);

    const formData = new FormData();
    formData.append('customerName', values.name);
    formData.append('phone', values.phone);
    formData.append('email', values.email);
    formData.append('quantity', String(values.quantity));
    formData.append('price', String(values.price));
    formData.append('discount', String(values.discount));
    formData.append('addition', values.addition);
    formData.append('products', JSON.stringify(values.products));
    formData.append('cristals', JSON.stringify(values.cristals));
    formData.append('graduations', JSON.stringify(values.graduations));
    // product images
    files.forEach((file) => formData.append('files', file));

    try {
      await axios.put(`/api/recipe-upload/${recipe?._id}`, formData);
      setLoadingButton(false);
      toast.success('Receta actualizada exitosamente');
      mutate();
      push('/admin/products');
    } catch (error) {
      setLoadingButton(false);
      toast.error(getErrorMessage(error));
    }
  };

  // HANDLE DELETE UPLOADED PRODUCT IMAGE
  const handleDeleteExistingImage = (image: ProductImage) => {
    setExistingImage((state) => state.filter((item) => item.key !== image.key));
    setDeletedImage((state) => [...state, { Key: image.key }]);
  };

  // HANDLE UPLOAD NEW PRODUCT IMAGE FILE
  const handleFileDelete = (file: File) => {
    setFiles((files) => files.filter((item) => item.name !== file.name));
  };

  // SHOW LOADING STATUS WHEN DATA FETCHING
  if (isLoading) return <Loading />;

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
                  <InputLabel id="graduations">
                    Selecciona graduación
                  </InputLabel>
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
                <DropZone
                  onChange={(files) => {
                    const uploadFiles = files.map((file) =>
                      Object.assign(file, { preview: URL.createObjectURL(file) })
                    );
                    setFiles(uploadFiles);
                  }}
                />

                <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                  {existingImage.map((image: any, i) => {
                    return (
                      <UploadImageBox
                        key={i}
                        image={image.location}
                        handleClear={() => handleDeleteExistingImage(image)}
                      />
                    );
                  })}

                  {files.map((file, index) => {
                    return (
                      <UploadImageBox
                        key={index}
                        image={file.preview}
                        handleClear={() => handleFileDelete(file)}
                      />
                    );
                  })}
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

{/*               <Grid item xs={12}>
                <LoadingButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  loading={loadingBtn}
                >
                  Guardar receta
                </LoadingButton>
              </Grid> */}
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

// ==================================================================
RecipeDetails.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminDashboardLayout>
      <DashboardPageHeader
        title="Editar Producto"
        Icon={DeliveryBox}
        button={getHeaderLink('/admin/recipes', 'Volver a la lista de recetas')}
      />

      {page}
    </AdminDashboardLayout>
  );
};
// ==================================================================

export default RecipeDetails;
