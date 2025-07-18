import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#CC0000', // Un rojo más suave para YouTube
    },
    secondary: {
      main: '#282828', // Gris oscuro/negro
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
