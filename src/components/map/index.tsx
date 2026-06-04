import React from 'react';

import type { IMapComponent } from './interfaces/map.interface';
import { mapStyle, styles } from './styles';
import { Box } from '@mui/material';
import {
  GoogleMap,
  LoadScript,
  MarkerF,
} from '@react-google-maps/api';

const MapComponent = ({
  lat = '-33.4372',
  lng = '-70.6506',
  googleMapProps,
  loadScriptProps,
  markerProps,
  containerProps,
}: IMapComponent) => {
  const defaultPosition = {
    lat: Number(lat),
    lng: Number(lng),
  };

  const apiKey = process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_KEY;

  return (
    <Box sx={styles().containerMap} {...containerProps}>
      <LoadScript
        id="google-map-id"
        googleMapsApiKey={apiKey as string}
        {...loadScriptProps}
      >
        <GoogleMap
          mapContainerStyle={mapStyle}
          center={defaultPosition}
          zoom={18}
          options={{
            disableDefaultUI: true,
            clickableIcons: true,
            scrollwheel: false,
          }}
          {...googleMapProps}
          mapTypeId={'roadmap'}
        >
          <MarkerF position={defaultPosition} />
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapComponent;
