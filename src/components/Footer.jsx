import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* First Column - Bali Corner Tour */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Bali On Pocket</h3>
            <p className="text-gray-400 mb-6">
              Whether you're looking for exciting <span className="italic">daily tours</span>, adrenaline-filled
              <span className="italic"> adventure tours</span>, seamless <span className="italic">airport transfers</span>, or a magical escape
              to <span className="italic">Nusa Penida</span>, we're here to ensure your journey is hassle-free
              and filled with incredible memories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </motion.div>

          {/* Second Column - Our Services */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6">Our Services</h3>
            <div className="border-t border-gray-700 pt-6">
              <ul className="space-y-4">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-amber-500">›</span>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-amber-500">›</span>
                    <span>Tour Packages</span>
                  </Link>
                </li>
                <li>
                  <Link to="/airport-transit" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-amber-500">›</span>
                    <span>Airport Transit</span>
                  </Link>
                </li>
                <li>
                  <Link to="/car-rental" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-amber-500">›</span>
                    <span>Car Rental</span>
                  </Link>
                </li>
                <li>
                  <Link to="/company-profile" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-amber-500">›</span>
                    <span>Company Profile</span>
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Third Column - Get in Touch */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <div className="border-t border-gray-700 pt-6">
              <ul className="space-y-6 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 flex-shrink-0 text-gray-500" size={20} />
                  <span>Jl. Mertasari Gg. Kertabedulu I No. 1 B, Denpasar, Bali.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="flex-shrink-0 text-gray-500" size={20} />
                  <span>+62 821 4477 9445</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="flex-shrink-0 text-gray-500" size={20} />
                  <span>balicornertour@gmail.com</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;