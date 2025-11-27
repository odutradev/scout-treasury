import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from 'react-toastify';
import { createRoot } from 'react-dom/client';
import { StrictMode, useMemo } from 'react';

import { darkTheme, lightTheme } from "@styles/muiBaseTheme";
import { toastContainerConfig } from '@assets/data/toast';
import useSystemTheme from "@hooks/useSystemTheme";
import defaultConfig from '@assets/config/default';
import GlobalStyles from '@styles/globalStyles';
import useMountOnce from '@hooks/useMountOnce';
import useSystemStore from '@stores/system';
import Router from '@routes/index';


const App = () => {
  const { theme} = useSystemStore((store) => store.system);
  
  useSystemTheme();

  useMountOnce(() => {
    console.log(`version: ${defaultConfig.version} - mode: ${defaultConfig.mode}`);
  });

  const toastExtra = useMemo(() => {
    return theme == 'dark' ? { theme } : {};
  }, [theme]);

  const currentTheme = theme == "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <title>{defaultConfig.title}</title>
      <ToastContainer {...toastContainerConfig} {...toastExtra} />
        <GlobalStyles />
        <CssBaseline />
        <Router />
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
