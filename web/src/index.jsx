import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LoadingProvider } from './context/LoadingContext';
import themeMui from './config/themeMui';
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={themeMui}>
        <CssBaseline />
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
)
