import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { fetchTourPackageById, addTourPackageToCart } from '../services/tourPackageApi'; // Pastikan path ini benar
import { addItemToCart } from "../services/cartApi";

function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(2);
  const [selectedDate, setSelectedDate] = useState("");
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [message, setMessage] = useState("");

  const safe = html => ({ __html: DOMPurify.sanitize(html) });

  // Cek status login saat komponen pertama kali dirender
  useEffect(() => {
    // Menggunakan 'authToken' sesuai kesepakatan dari apiClient Julius
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Jika ada token, berarti logged in
  }, []);

  // Effect untuk mengambil data paket tour dari API
  useEffect(() => {
    const getPackageDetail = async () => {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const data = await fetchTourPackageById(id);
        const transformedData = { ...data };

        if (transformedData.features && Array.isArray(transformedData.features) && transformedData.features.length > 0) {
          transformedData.longDescription = `${transformedData.longDescription}. What's Included: ${transformedData.features.join(', ')}.`;
          // transformedData.features = undefined; // Opsional: hapus jika tidak lagi diperlukan
        }
        setPackageData(transformedData);
      } catch (err) {
        console.error("Error fetching package detail:", err);
        setError("Failed to load package details. Please try again.");
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load package details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getPackageDetail();
    }
  }, [id]);

  const handleOrder = async (e) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to continue with your booking",
        variant: "destructive",
      });
      localStorage.setItem("redirectAfterLogin", `/packages/${id}`);
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "Choose your preferred date for the journey",
        variant: "destructive",
      });
      
      setIsFailed(true);
      setMessage("Choose your preferred date for the journey")
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj < today) {
      toast({
        title: "Invalid date",
        description: "Please select a future date for your journey",
        variant: "destructive",
      });
      
      setIsFailed(true);
      setMessage("Please select a future date for your journey")
      return;
    }

    if (quantity < 2) {
      toast({
        title: "Minimum guests required",
        description: "This package requires at least 2 guests",
        variant: "destructive",
      });
      
      setIsFailed(true);
      setMessage("This package requires at least 2 guests")
      return;
    }

    if (!packageData) return;
    
    e.target.disabled = true;
    e.target.textContent = "Adding to cart...";

    try {
      // --- START PERUBAHAN DI SINI ---
      const itemToAdd = {
        item_id: packageData.id,
        quantity: quantity,
        tour_date: selectedDate,
        // Menambahkan field item_type
        item_type: "tour_package",
      };

      // Panggil fungsi API untuk menambahkan item ke keranjang
      // Sesuaikan `addTourPackageToCart` agar menerima objek itemToAdd
      const response = await addItemToCart(itemToAdd);
      // --- END PERUBAHAN DI SINI ---

      localStorage.setItem("currentOrder", JSON.stringify(response));

      toast({
        title: "Successfully Added to Cart",
        description: `${packageData.title} has been added to your cart!`,
      });

      navigate("/cart");
    } catch (apiError) {
      console.error("Error adding package to cart:", apiError);
      
      setIsFailed(true);
      setMessage(apiError.response?.data?.message || "Something went wrong. Please try again.")
    }
    
    e.target.disabled = false;
    e.target.textContent = "Add to cart";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{error}</h2>
          <Button onClick={() => navigate("/packages")}>Back to Packages</Button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Package not found</h2>
          <Button onClick={() => navigate("/packages")}>Back to Packages</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img alt={packageData.title} className="w-full h-full object-cover" src={packageData.media_url} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-3xl text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{packageData.name}</h1>
              {/* <p className="">{packageData.description}</p> */}
              {/* <div className="text-base md:text-xl mb-6" dangerouslySetInnerHTML={safe(packageData.description)} /> */}
              <div className="flex flex-wrap gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl">⏱</span>
                  <span>{packageData.duration}</span> {/* Perlu dicek */}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl">✨</span>
                  <span>{packageData.highlight}</span> {/* Perlu dicek */}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">About This Tour</h2>
              {/* <p className="text-gray-700 mb-6">{packageData.description}</p> Perlu dicek */}
              <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={safe(packageData.description)} />
            </motion.section>
          </div>

          {/* Booking Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-2">${packageData.price_per_pax} USD</h2>
              <p className="text-gray-600 mb-6">per person</p>

              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {!selectedDate && (
                    <p className="text-sm text-red-500 mt-1">Please select a date for your journey</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-2">Number of Guests</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Guests
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-blue-600 mt-2">Minimum 2 guests required</p>
                </div>

                <div className="border-t pt-6">
                  { isFailed && (<p className="text-red-500">{ message }</p> ) }
                  <div className="flex justify-between mb-4">
                    <span>Total</span>
                    <span className="font-bold text-xl">${packageData.price_per_pax * quantity}</span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full text-lg bg-gradient-to-r hover:bg-teal-600/50 text-white"
                    onClick={handleOrder}
                  >
                    {isLoggedIn ? "Add to Cart" : "Login & Add to Cart"}
                  </Button>

                  {!isLoggedIn && (
                    <p className="text-sm text-amber-600 mt-2 text-center">You need to be logged in to book this journey</p>
                  )}
                </div>

                <p className="text-sm text-gray-500 text-center">Free cancellation up to 24 hours before the journey</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PackageDetail;