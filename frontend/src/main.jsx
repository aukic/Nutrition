import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { setDefaultOptions } from 'date-fns';
import { hr } from 'date-fns/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { hrHR } from '@mui/material/locale';

const theme = createTheme(
    {},
    hrHR
);
setDefaultOptions({ locale: hr });

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
            <App />
      </ThemeProvider>
  </StrictMode>,
)
