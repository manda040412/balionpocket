import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import fungsi API yang baru kita buat
import { fetchAvailableCars, createCarRentalOrder } from '../services/carRentalApi';
import { addItemToCart } from "../services/cartApi";

function CarDetail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [selectedDates, setSelectedDates] = useState({
    start: "",
    end: "",
  });
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const getCars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAvailableCars();
        setCars(data);
        if (data.length > 0) {
          setSelectedCarId(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load available cars. Please try again.");
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load car list.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getCars();
  }, []);

  const carData = cars.find((car) => car.id === selectedCarId);

  const calculateTotal = () => {
    if (!carData) return 0;
    if (!selectedDates.start || !selectedDates.end) return carData.price_per_day;

    const start = new Date(selectedDates.start);
    const end = new Date(selectedDates.end);

    if (end < start) return 0;

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return carData.price_per_day * days;
  };

  const handleRent = async (e) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to rent a car",
        variant: "destructive",
      });
      localStorage.setItem("redirectAfterLogin", "/car-detail");
      navigate("/login");
      
      setIsFailed(true);
      setMessage("Please login to rent a car")
      return;
    }

    if (!selectedDates.start || !selectedDates.end) {
      toast({
        title: "Please select dates",
        description: "Choose your rental period",
        variant: "destructive",
      });
      
      setIsFailed(true);
      setMessage("Choose your rental period")
      return;
    }

    const start = new Date(selectedDates.start);
    const end = new Date(selectedDates.end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today || end < today || end < start) {
      toast({
        title: "Invalid Dates",
        description: "Please select valid future dates for your rental.",
        variant: "destructive",
      });
      
      setIsFailed(true);
      setMessage("Please select valid future dates for your rental.")
      return;
    }

    if (!carData) {
      toast({
        title: "Error",
        description: "No car selected or car data not found.",
        variant: "destructive",
      });
      
      setIsFailed(true);
      setMessage("No car selected or car data not found.")
      return;
    }
    
    e.target.disabled = true;
    e.target.textContent = "Adding to cart...";

    const orderData = {
      item_id: carData.id,
      start_date: selectedDates.start,
      end_date: selectedDates.end,
      // --- START PERUBAHAN DI SINI ---
      item_type: "car_rental", // Menambahkan field item_type
      // --- END PERUBAHAN DI SINI ---
    };

    try {
      const response = await addItemToCart(orderData);

      toast({
        title: "Car Reserved",
        description: `Your ${carData.name} rental has been added to cart`,
      });

      navigate("/cart");
    } catch (apiError) {
      console.error("Error submitting car rental order:", apiError);
      
      setIsFailed(true);
      setMessage(apiError.response?.data?.message || "Failed to reserve the car. Please try again.")
    }
    
    e.target.disabled = false;
    e.target.textContent = "Add to cart";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p>Loading available cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate("/")}>Go to Home</Button>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p>No cars available for rental.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[40vh] overflow-hidden">
        <img alt="Car rental service" className="w-full h-full object-cover" src="/api/placeholder/1200/600" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">Car Rental</h1>
              <p className="text-xl md:text-2xl">Select your preferred vehicle for your trip</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Options */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h2 className="text-3xl font-bold mb-6 text-teal-800">Available Cars</h2>
              <div className="space-y-4">
                {cars.map((car) => (
                  <div key={car.id} className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedCarId === car.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`} onClick={() => setSelectedCarId(car.id)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedCarId === car.id ? "border-teal-500" : "border-gray-300"}`}>
                        {selectedCarId === car.id && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                      </div>

                      <div className="flex flex-1 gap-4">
                        <div className="w-36 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={car.media_url} alt={car.name} className="w-full h-full object-cover" />
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-teal-800">{car.name}</h3>
                          <p className="text-lg font-medium">
                            {/* Convert jam nya ke satuan yang benar. */}
                            {car.duration_per_day} Hours/day (${car.price_per_day})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* What's Included */}
            {/* Perlu dicek kembali fungsinya buat apa? kepake atau nga? Ini error btw. */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-teal-800">What's Included</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  <span className="text-gray-700 text-lg font-medium">Private Car</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  <span className="text-gray-700 text-lg font-medium">Driver</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  <span className="text-gray-700 text-lg font-medium">Petrol</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  <span className="text-gray-700 text-lg font-medium">Parking Tol</span>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Booking Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-2 text-teal-800">{carData.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                {/* Convert jam nya ke satuan yang benar. */}
                <span className="text-2xl font-bold text-teal-800">${carData.price_per_day}</span>
                <span className="text-gray-600 text-lg">{carData.duration_per_day} Hour/day</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-bold mb-2 text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={selectedDates.start}
                    onChange={(e) => setSelectedDates((prev) => ({ ...prev, start: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={selectedDates.end}
                    onChange={(e) => setSelectedDates((prev) => ({ ...prev, end: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500"
                    min={selectedDates.start || new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="border-t pt-6">
                  { isFailed && (<p className="text-red-500">{ message }</p> ) }
                  <div className="flex justify-between mb-4 text-lg">
                    <span className="text-gray-700">Total</span>
                    <span className="font-bold text-teal-800">${calculateTotal()}</span>
                  </div>

                  <Button size="lg" className="w-full text-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white" onClick={handleRent}>
                    Add to Cart
                  </Button>
                </div>

                <p className="text-sm text-gray-500 text-center">Free cancellation up to 24 hours before pickup</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CarDetail;