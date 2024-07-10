import React from 'react';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import publicRoutes from '../routes/publicRoutes';
import privateRoutes from '../routes/privateRoutes';
import AdminLayout from '../Auth/components/layout/Layout';
import Categories from '../Auth/pages/Categories';
import Dashboard from '../Auth/pages/Dashboard';
import Products from '../Auth/pages/Products';
import { Route, useLocation, Navigate, Routes } from 'react-router-dom';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.toLowerCase().includes('system');
  
  return (
    <Routes>
      {isAdminRoute ? (
        <Route element={<AdminLayout location={location} />}>
          {/* <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/products" element={<Products />} /> */}

          {Object.values(privateRoutes).map(({ path, component: Component, requiredLogin }) => (
              <Route
                key={path}
                path={path}
                element={requiredLogin ? <Component /> : <Navigate to="/login" />}
              />
            ))}
        </Route>
      ) : (
        <>
          <Route element={<PublicLayout />}>
            {Object.values(publicRoutes).map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>

          <Route element={<PrivateLayout />}>
            {Object.values(privateRoutes).map(({ path, component: Component, requiredLogin }) => (
              <Route
                key={path}
                path={path}
                element={requiredLogin ? <Component /> : <Navigate to="/login" />}
              />
            ))}
          </Route>
        </>
      )}
    </Routes>
  );
}

export default AppLayout;
