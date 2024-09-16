import { useContext, useEffect } from 'react';
import { Context } from './main';
import { observer } from 'mobx-react-lite';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const { store } = useContext(Context);

  // The code below is for refresh token implementation
  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     store.checkAuth();
  //   }
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/welcome" element={<Welcome />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default observer(App);
