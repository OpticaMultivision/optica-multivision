import type { BoxProps } from '@mui/material';
import type {
  GoogleMapProps,
  LoadScriptProps,
  MarkerProps,
} from '@react-google-maps/api';

export interface IMapComponent {
  lat: string;
  lng: string;
  loadScriptProps?: LoadScriptProps;
  googleMapProps?: GoogleMapProps;
  markerProps?: MarkerProps;
  containerProps?: BoxProps;
}
