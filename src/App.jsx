import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import PackageDetail from "./pages/PackageDetail"
import CarDetail from "./pages/CarDetail"
import AirportTransit from "./pages/AirportTransit"
import Checkout from "./pages/Checkout"
import Packages from "./pages/Packages"
import Login from "./pages/Login"
import { Toaster } from "./components/ui/toaster"
import Profile from "./pages/Profile"
import CompanyProfile from './pages/CompanyProfile'
import Cart from './pages/Cart'


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/package/:id" element={<PackageDetail />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/airport-transit" element={<AirportTransit />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
        <Toaster />
      </div>
    </Router>
  )
}

export default App