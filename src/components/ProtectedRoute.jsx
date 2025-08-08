import { Navigate, Outlet } from 'react-router-dom';
import { isLogin } from '../lib/utils';

const ProtectedRoute = () => {
  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;