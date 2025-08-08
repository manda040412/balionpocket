import { Navigate, Outlet } from 'react-router-dom';
import { isLogin } from '../lib/utils'; // Import fungsi isLogin

const PublicRoute = () => {
  // Jika sudah login, alihkan ke halaman utama
  if (isLogin()) {
    return <Navigate to="/" replace />;
  }

  // Jika belum login, lanjutkan ke halaman login atau register
  return <Outlet />;
};

export default PublicRoute;