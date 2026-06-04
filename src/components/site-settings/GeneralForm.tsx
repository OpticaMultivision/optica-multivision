import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, styled, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
// custom components
import Loading from 'components/Loading';
import { H6 } from 'components/Typography';
import FlexBox from 'components/flex-box/FlexBox';
// custom hook
import useFetchSiteSetting from 'hooks/useFetchSiteSetting';
// api route param slug list
import { db_slug } from 'utils/constants';
// utils function for show error message
import getErrorMessage from 'utils/getErrorMessage';

// ==============================================================
interface FileType extends File {
  preview: string;
  location: string;
  key?: string;
}
// ==============================================================

// styled component
const UploadBox = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  padding: '5px 10px',
  borderRadius: '4px',
  display: 'inline-block',
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
}));

// form field validation
const validationSchema = yup.object().shape({
  site_name: yup.string().required('site name is required'),
  site_description: yup.string().required('site description is required'),
  site_banner_text: yup.string().required('site banner text required'),
});

const GeneralForm: FC = () => {
  const [logo, setLogo] = useState<File>();
  const [bannerImage, setBannerImage] = useState<FileType>();
  const [loadingButton, setLoadingButton] = useState(false);
  const { data, loading, refetch } = useFetchSiteSetting(
    `/api/settings/${db_slug.general_site_setting}`
  );

  const initialValues = {
    site_name: data?.site_name || '',
    site_description: data?.site_description || '',
    site_banner_text: data?.site_banner_text || '',
  };

  // HANDLE FORM SUBMIT
  const handleFormSubmit = async (values: typeof initialValues) => {
    setLoadingButton(true);
    const formData = new FormData();

    if (logo) formData.append('logo', logo);
    if (bannerImage) formData.append('image', bannerImage);

    formData.append('site_name', values.site_name);
    formData.append('setting_name', db_slug.general_site_setting);
    formData.append('site_description', values.site_description);
    formData.append('site_banner_text', values.site_banner_text);

    try {
      await axios.post('/api/settings/general', formData);
      toast.success('Datos actualizados exitosamente');
      refetch();
      setLoadingButton(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLoadingButton(false);
    }
  };

  // upload images handler
  const handleOnChangeDropZone = (file: File) => {
    const uploadFiles = Object.assign(file, {
      preview: URL.createObjectURL(file),
      location: '',
    });
    setBannerImage(uploadFiles);
  };

  useEffect(() => {
    if (data) setBannerImage(data?.site_banner);
  }, [data]);

  // SHOW LOADING STATUS WHEN DATA FETCHING
  if (loading) return <Loading />;

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <H6 mb={1}>Logo del sitio</H6>
              <FlexBox alignItems="center" gap={2}>
                <label htmlFor="site_logo">
                  <UploadBox>Subir</UploadBox>
                </label>

                <input
                  hidden
                  type="file"
                  id="site_logo"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files?.[0])}
                />

                {data?.site_logo && (
                  <Box position="relative" width={140} height={40}>
                    <Image
                      fill
                      alt="banner"
                      src={data.site_logo.location}
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                )}
              </FlexBox>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                name="site_name"
                label="Nombre del sitio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.site_name}
                error={!!touched.site_name && !!errors.site_name}
                helperText={(touched.site_name && errors.site_name) as string}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                name="site_description"
                label="Descripción del sitio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.site_description}
                error={!!touched.site_description && !!errors.site_description}
                helperText={
                  (touched.site_description &&
                    errors.site_description) as string
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                onBlur={handleBlur}
                name="site_banner_text"
                onChange={handleChange}
                label="Descripción texto del banner"
                value={values.site_banner_text}
                error={!!touched.site_banner_text && !!errors.site_banner_text}
                helperText={
                  (touched.site_banner_text &&
                    errors.site_banner_text) as string
                }
              />
            </Grid>

            <Grid item xs={12}>
              <H6 mb={1}>Imagen banner principal</H6>
              <label htmlFor="banner_image">
                <UploadBox>Subir</UploadBox>
              </label>

              <input
                hidden
                type="file"
                accept="image/*"
                id="banner_image"
                onChange={(e) => {
                  handleOnChangeDropZone(e.target.files?.[0] as File);
                }}
              />

              {bannerImage && (
                <Box mt={2} position="relative" width={170} height={80}>
                  <Image
                    fill
                    src={
                      !bannerImage.location
                        ? bannerImage.preview
                        : bannerImage.location
                    }
                    alt="banner"
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
              )}
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
  );
};

export default GeneralForm;
