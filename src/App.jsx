    import React from "react";
    import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
    import Navbar from "./components/Navbar";
    import Footer from "./components/Footer";
    import Home from "./pages/Home";
    import PackageDetail from "./pages/PackageDetail";
    import CarDetail from "./pages/CarDetail";
    import AirportTransit from "./pages/AirportTransit";
    import Checkout from "./pages/Checkout";
    import Packages from "./pages/Packages";
    import Login from "./pages/Login";
    import { Toaster } from "./components/ui/toaster";
    import Profile from "./pages/Profile";
    import CompanyProfile from './pages/CompanyProfile'; // Keep this import
    import Cart from './pages/Cart';
    import Callback from "./pages/api/auth/callback";

    import ProtectedRoute from './components/ProtectedRoute';
    import PublicRoute from './components/PublicRoute';

    function App() {
      console.log("App is running");
      return (
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              {/* Rute yang dapat diakses oleh siapa saja (publik) */}
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/package/:id" element={<PackageDetail />} />
              <Route path="/car/:id" element={<CarDetail />} />
              <Route path="/airport-transit" element={<AirportTransit />} />
              <Route path="/api/auth/callback" element={<Callback />} />
              <Route path="/company-profile" element={<CompanyProfile />} /> {/* <-- Moved here to be public */}

              {/* Rute yang hanya bisa diakses oleh pengguna yang BELUM login */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
              </Route>

              {/* Rute yang hanya bisa diakses oleh pengguna yang SUDAH login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
              </Route>

              {/* Rute untuk halaman 404 (Not Found) */}
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
            <Footer />
            <Toaster />
          </div>
        </Router>
      );
    }

    export default App;
    