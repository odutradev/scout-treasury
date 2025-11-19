import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ReloadHandler from '@routes/components/reloadHandler';
import useAuthStore from '@stores/auth';
import routesPaths from '@routes/routes';

const Router = () => {
  const { auth } = useAuthStore();
  
  return (
    <BrowserRouter>
      <ReloadHandler />
      <Routes>
        {routesPaths.map(({ path, privateRoute, routes }) =>
          routes.map(([itemPath, element]) => {
            return (
              <Route
                key={path + itemPath}
                path={path + itemPath}
                element={privateRoute && !auth.isAuthenticated ? <Navigate to="/signin" /> : element}
              />
          )})
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;