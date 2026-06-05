import React from 'react';

import { Box, Fab } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';

const FabButtonComponent = () => {
  return (
    <Box>
      <Fab
        onClick={() =>
          window.open(
            'https://www.instagram.com/optica.multivision_lascondes/',
            '_blank'
          )
        }
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 30,
          background:
            'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
        }}
      >
        <InstagramIcon />
      </Fab>
    </Box>
  );
};

export default FabButtonComponent;
