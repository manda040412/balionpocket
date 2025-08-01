import React, { useState, useEffect } from "react"; // Tambahkan useEffect
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, Users, Plane, MapPin } from "lucide-react";

// Import fungsi API yang baru kita buat
import { fetchAirportTransitDestinations, createAirportTransferOrder } from '../services/airportTransitApi';

function AirportTransfer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDestination, setSelectedDestination] = useState(""); // Default kosong, akan diisi dari API
  const [destinations, setDestinations] = useState([]); // State untuk menyimpan data destinasi dari API
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    passengers: 1,
    flightNumber: "",
    pickupTerminal: "",
    dropoffAddress: "",
  });

  // Effect untuk mengambil data destinasi saat komponen dimuat
  useEffect(() => {
    const getDestinations = async () => {
      try {
        setLoading(true);
        const data = await fetchAirportTransitDestinations();
        setDestinations(data);
        if (data.length > 0) {
          setSelectedDestination(data[0].id); // Set default ke destinasi pertama
        }
      } catch (err) {
        setError("Failed to load destinations. Please try again later.");
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load airport transit destinations.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getDestinations();
  }, []); // [] agar hanya berjalan sekali saat komponen mount

  const destinationData = destinations.find((dest) => dest.id === selectedDestination) || destinations[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    // Pastikan destinationData ada sebelum mencoba mengakses .price
    if (!destinationData) return 0;
    const basePrice = destinationData.price;
    return basePrice * formData.passengers;
  };

  const handleSubmit = async () => { // Jadikan async
    if (!formData.date || !formData.time || !formData.dropoffAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      destinationId: selectedDestination, // Kirim ID destinasi
      type: "airport-transfer",
      date: formData.date,
      time: formData.time,
      passengers: formData.passengers,
      flightNumber: formData.flightNumber,
      pickupTerminal: formData.pickupTerminal,
      dropoffAddress: formData.dropoffAddress,
      // Anda mungkin juga ingin mengirim total harga yang dihitung di frontend,
      // tapi lebih aman jika total harga juga dihitung di backend untuk mencegah manipulasi.
      // total: calculateTotal(),
    };

    try {
      // Panggil fungsi API untuk membuat pesanan
      const response = await createAirportTransferOrder(orderData);

      // Setelah berhasil, Anda bisa menyimpan respons atau melakukan navigasi
      localStorage.setItem("currentOrder", JSON.stringify(response)); // Simpan respons API
      toast({
        title: "Transfer Reserved",
        description: `Your airport transfer to ${destinationData.name} has been added to cart`,
      });
      navigate("/checkout"); // Navigasi ke halaman checkout
    } catch (apiError) {
      console.error("Error submitting airport transfer order:", apiError);
      toast({
        title: "Order Failed",
        description: apiError.response?.data?.message || "Failed to submit your transfer order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p>Loading destinations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Jika tidak ada destinasi yang ditemukan (misal dari API kosong)
  if (!destinationData) {
      return (
          <div className="min-h-screen flex items-center justify-center pt-20">
              <p>No airport transfer destinations available.</p>
          </div>
      );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[40vh] overflow-hidden">
        <img alt="Airport transfer service" className="w-full h-full object-cover" src="/api/placeholder/1200/600" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">Airport Transfer</h1>
              <p className="text-xl md:text-2xl">Get to your destination comfortably and safely</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Destination Options */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h2 className="text-3xl font-bold mb-6 text-teal-800">Available Destinations</h2>
              <div className="space-y-4">
                {destinations.map((destination) => (
                  <div
                    key={destination.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedDestination === destination.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}
                    onClick={() => setSelectedDestination(destination.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedDestination === destination.id ? "border-teal-500" : "border-gray-300"}`}>
                        {selectedDestination === destination.id && <div className="w-3 h-3 bg-teal-500 rounded-full"></div>}
                      </div>

                      <div className="flex flex-1 gap-4">
                        <div className="w-36 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-teal-800">{destination.name}</h3>
                          <p className="text-lg font-medium">
                            {destination.distance} (${destination.price})
                          </p>
                          <p className="text-sm text-gray-500">{destination.duration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* What's Included */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-teal-800">What's Included</h2>
              <div className="grid grid-cols-1 gap-4">
                {destinationData.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-teal-500 text-xl">✓</span>
                    <span className="text-gray-700 text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Booking Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-2 text-teal-800">Transfer to {destinationData.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-teal-800">${destinationData.price}</span>
                <span className="text-gray-600 text-lg">per transfer</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700">
                    <Calendar size={18} />
                    Date
                  </label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500" min={new Date().toISOString().split("T")[0]} />
                </div>

                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700">
                    <Clock size={18} />
                    Time
                  </label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500" />
                </div>

                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700">
                    <Users size={18} />
                    Passengers
                  </label>
                  <select name="passengers" value={formData.passengers} onChange={handleInputChange} className="w-full border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500">
                    {[1, 2, 3, 4, 5].map((num) => ( // Max 5 passengers
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700">
                    <Plane size={18} />
                    Flight Number
                  </label>
                  <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleInputChange} placeholder="Optional" className="w-full border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500" />
                </div>

                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700">Terminal</label>
                  <input
                    type="text"
                    name="pickupTerminal"
                    value={formData.pickupTerminal}
                    onChange={handleInputChange}
                    placeholder="International/Domestic (Optional)"
                    className="w-full border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 font-bold mb-2 text-gray-700">
                    <MapPin size={18} />
                    Dropoff Address
                  </label>
                  <textarea
                    name="dropoffAddress"
                    value={formData.dropoffAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your hotel name or address"
                    className="w-full border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500"
                    rows="3"
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between mb-4 text-lg">
                    <span className="text-gray-700">Total</span>
                    <span className="font-bold text-teal-800">${calculateTotal()}</span>
                  </div>

                  <Button size="lg" className="w-full text-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white" onClick={handleSubmit}>
                    Add to Cart
                  </Button>
                </div>

                <p className="text-sm text-gray-500 text-center">Free cancellation up to 24 hours before pickup • Driver will wait up to 90 minutes</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AirportTransfer;