import { Navigate, Outlet } from 'react-router-dom';
import { Context } from '../main';
import { useContext } from 'react';

const PrivateRoute = () => {
  const { store } = useContext(Context);

  const isAuth = store.isAuth;
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
