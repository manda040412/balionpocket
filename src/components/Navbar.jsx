import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import { isLogin } from "../lib/utils";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUserName("");
    navigate("/");
  };

  const buttonClass = "bg-white text-gray-900 border border-white hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors duration-300";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${!isScrolled && location.pathname === "/" ? "bg-transparent py-4" : "bg-white shadow-md py-2"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className={`font-bold text-2xl ${!isScrolled && location.pathname === "/" ? "text-white" : "text-gray-900"}`}>Bali On Pocket</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Home
            </Link>
            <Link to="/packages" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Tour Packages
            </Link>
            <Link to="/airport-transit" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Airport Transit
            </Link>
            <Link to="/car/1" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Car Rental
            </Link>
            <Link to="/company-profile" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Company Profile
            </Link>
            <Link to="/gallery" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Gallery
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Shopping Cart Icon */}
            <Link to="/cart" className={`p-2 rounded-full hover:bg-gray-100 ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80 hover:bg-white/10" : "text-gray-700 hover:text-blue-600"}`}>
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {isLogin() ? (
              <div className="flex items-center space-x-4">
                <div className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white" : "text-gray-900"}`}>Hello, {userName}</div>
                <Link to="/profile" className={`p-2 rounded-full hover:bg-gray-100 ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80 hover:bg-white/10" : "text-gray-700 hover:text-blue-600"}`}>
                  <User className="w-5 h-5" />
                </Link>
                <Button variant="outline" className={`text-sm md:text-base ${buttonClass}`} onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" className={`text-sm md:text-base ${buttonClass}`}>
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-md ${!isScrolled && location.pathname === "/" ? "text-white" : "text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {/* <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg> */}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-screen py-4" : "max-h-0"}`}>
          <nav className="flex flex-col space-y-4">
            <Link to="/" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Home
            </Link>
            <Link to="/packages" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Tour Packages
            </Link>
            <Link to="/airport-transit" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Airport Transit
            </Link>
            <Link to="/car-rental" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Car Rental
            </Link>
            <Link to="/company-profile" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Company Profile
            </Link>
            <Link to="/gallery" className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
              Company Profile
            </Link>

            <div className="pt-4 border-t border-gray-200">
              {/* Shopping Cart Link for Mobile */}
              <Link to="/cart" className={`flex items-center space-x-2 font-medium mb-4 ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </Link>

              {isLogin() ? (
                <div className="flex flex-col space-y-4">
                  <div className={`font-medium ${!isScrolled && location.pathname === "/" ? "text-white" : "text-gray-900"}`}>Hello, {userName}</div>
                  <Link to="/profile" className={`flex items-center space-x-2 font-medium ${!isScrolled && location.pathname === "/" ? "text-white hover:text-white/80" : "text-gray-700 hover:text-blue-600"}`}>
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <Button variant="outline" className={`w-full text-sm md:text-base ${buttonClass}`} onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/login" className="block">
                  <Button variant="outline" className={`w-full text-sm md:text-base ${buttonClass}`}>
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
