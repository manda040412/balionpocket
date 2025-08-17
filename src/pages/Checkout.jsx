import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Import API functions
import { processCheckout } from '../services/paymentApi'; // Pastikan path ini benar

function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    specialRequests: "",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: ""
  });
  const [isLoading, setIsLoading] = useState(false); // State untuk loading saat submit

  useEffect(() => {
    // Memuat order dari localStorage.
    // Jika order bisa diambil ulang dari API berdasarkan ID, itu lebih baik untuk keamanan.
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        setOrder(parsedOrder);

        // Jika Anda ingin mengisi form dengan data pengguna yang login
        const userName = localStorage.getItem("userName");
        const userEmail = localStorage.getItem("userEmail");
        if (userName && userEmail) {
          setFormData(prev => ({
            ...prev,
            name: userName,
            email: userEmail,
            // phone dan nationality mungkin juga dari profil user
          }));
        }
      } catch (e) {
        console.error("Error parsing saved order:", e);
        setOrder(null);
        toast({
          title: "Error Loading Order",
          description: "There was an issue loading your order details. Please try again from cart.",
          variant: "destructive"
        });
        navigate("/cart"); // Redirect ke keranjang jika order tidak valid
      }
    } else {
      toast({
        title: "No Order Found",
        description: "Please select a journey before proceeding to checkout.",
        variant: "destructive"
      });
      navigate("/"); // Redirect ke home atau halaman paket jika tidak ada order
    }
  }, [navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => { // Jadikan async
    e.preventDefault();

    if (!order) {
      toast({
        title: "No Order Available",
        description: "Please go back to cart to select an order.",
        variant: "destructive"
      });
      return;
    }
    
    // Client-side validation
    if (!formData.name || !formData.email || !formData.phone || !formData.nationality) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required personal information fields.",
        variant: "destructive"
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
        toast({
          title: "Missing Payment Information",
          description: "Please fill in all credit card details.",
          variant: "destructive"
        });
        return;
      }
      // Tambahkan validasi format kartu/expiry/cvc di sini jika diinginkan
      // Contoh: regex untuk kartu, cek format MM/YY, dll.
    }

    setIsLoading(true); // Mulai loading

    try {
      // Siapkan data untuk dikirim ke backend
      const checkoutData = {
        orderId: order.id, // Jika order memiliki ID dari backend, gunakan ini
        items: order.items || [order], // Jika order dari cart, bisa jadi array items. Jika dari detail, bisa jadi 1 item.
        totalAmount: order.total,
        personalInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          nationality: formData.nationality,
          specialRequests: formData.specialRequests,
        },
        paymentInfo: {
          method: formData.paymentMethod,
          // Jangan kirim data kartu kredit sensitif langsung ke backend di aplikasi nyata
          // Gunakan Payment Gateway SDK (Stripe.js, Midtrans.js, dll.) untuk tokenisasi kartu
          // Di sini kita hanya menyimulasikan pengiriman data mentah untuk tujuan belajar
          ...(formData.paymentMethod === "credit-card" && {
            cardNumber: formData.cardNumber,
            cardExpiry: formData.cardExpiry,
            cardCVC: formData.cardCVC,
          }),
        },
      };

      // Panggil API untuk memproses checkout
      const response = await processCheckout(checkoutData);
      
      if (response.status === 200) {
        toast({
          title: "Booking Confirmed!",
          description: response.message || "Your journey details have been sent to your email.",
        });
        
        localStorage.removeItem("currentOrder");
        localStorage.removeItem("cartItems"); // Mungkin juga kosongkan keranjang
        // TODO: arahkan user ke  link payment yang berhasil didapatkan setelah checkout
        // window.location.href = response.data.link;
      }

      // Bersihkan order lokal setelah sukses

    } catch (apiError) {
      console.error("Error during checkout:", apiError);
      toast({
        title: "Booking Failed",
        description: apiError.response?.data?.message || "Failed to complete your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">No journey selected</h1>
          <p className="text-gray-600 mb-6">Please go to our packages or cart to select a journey.</p>
          <Button onClick={() => navigate("/packages")}>Explore Journeys</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg backdrop-blur-sm bg-white/80">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Your Journey Details
                </h2>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 p-8 text-white mb-8">
                  <div className="relative z-10">
                    {/* Render single item or multiple items from order */}
                    {order.items && Array.isArray(order.items) ? (
                      order.items.map((item, index) => (
                        <div key={item.id || index} className="mb-4 pb-2 border-b border-white/20 last:border-b-0">
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <div className="flex justify-between items-center text-sm">
                            <span>Quantity</span>
                            <span className="font-semibold">{item.quantity || 1}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Price per unit</span>
                            <span className="font-semibold">${item.price?.toFixed(2) || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm mt-2">
                            <span>Subtotal</span>
                            <span className="font-semibold">${(item.price * (item.quantity || 1))?.toFixed(2) || 'N/A'}</span>
                          </div>
                          {/* Display additional details from item if available */}
                          {item.bookingDates && (
                            <div className="text-xs text-white/80 mt-2">
                                Date: {new Date(item.bookingDates.date || item.bookingDates.start).toLocaleDateString()}
                                {item.bookingDates.time && ` @ ${item.bookingDates.time}`}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      // Single item structure from PackageDetail or AirportTransit/CarDetail
                      <>
                        <h3 className="text-2xl font-bold mb-4">{order.title}</h3>
                        <div className="flex justify-between items-center mb-4">
                          <span>Date</span>
                          <span className="font-semibold">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        {order.quantity && (
                            <div className="flex justify-between items-center mb-4">
                                <span>Guests</span>
                                <span className="font-semibold">{order.quantity} person(s)</span>
                            </div>
                        )}
                        {order.startDate && order.endDate && (
                            <div className="flex justify-between items-center mb-4">
                                <span>Rental Period</span>
                                <span className="font-semibold">{new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}</span>
                            </div>
                        )}
                        {order.passengers && (
                            <div className="flex justify-between items-center mb-4">
                                <span>Passengers</span>
                                <span className="font-semibold">{order.passengers}</span>
                            </div>
                        )}
                      </>
                    )}
                    
                    <div className="border-t border-white/50 pt-4 flex justify-between items-center text-lg mt-4">
                      <span>Total</span>
                      <span className="font-bold">${order.total?.toFixed(2) || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                  <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                    {/* Ini mungkin perlu diambil dinamis dari order.items atau disesuaikan */}
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-600">
                        <span className="text-emerald-500 text-xl">✓</span>
                        Professional guide
                      </li>
                      <li className="flex items-center gap-3 text-gray-600">
                        <span className="text-emerald-500 text-xl">✓</span>
                        Hotel pickup & drop-off
                      </li>
                      <li className="flex items-center gap-3 text-gray-600">
                        <span className="text-emerald-500 text-xl">✓</span>
                        All entrance fees
                      </li>
                      <li className="flex items-center gap-3 text-gray-600">
                        <span className="text-emerald-500 text-xl">✓</span>
                        Lunch & refreshments
                      </li>
                    </ul>
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-500">
                      Free cancellation up to 24 hours before the journey starts
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Section - Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 shadow-lg backdrop-blur-sm bg-white/80"
            >
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Complete Your Booking
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your nationality"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`p-4 border rounded-xl flex items-center gap-3 transition-all ${
                        formData.paymentMethod === "credit-card"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                      }`}
                      onClick={() => handleInputChange({ target: { name: "paymentMethod", value: "credit-card" } })}
                    >
                      <span className="text-2xl">💳</span>
                      Credit Card
                    </button>
                    <button
                      type="button"
                      className={`p-4 border rounded-xl flex items-center gap-3 transition-all ${
                        formData.paymentMethod === "paypal"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                      }`}
                      onClick={() => handleInputChange({ target: { name: "paymentMethod", value: "paypal" } })}
                    >
                      <span className="text-2xl">🅿️</span>
                      PayPal
                    </button>
                  </div>
                </div>

                {/* Credit Card Details */}
                {formData.paymentMethod === "credit-card" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">Card Details</h3>
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2 text-gray-700">Expiry Date</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2 text-gray-700">CVC</label>
                        <input
                          type="text"
                          name="cardCVC"
                          value={formData.cardCVC}
                          onChange={handleInputChange}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Special Requests */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Special Requests (Optional)</h3>
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">Notes</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="e.g., dietary restrictions, specific pick-up instructions"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 rounded-xl transition-all transform hover:scale-[1.02]"
                    disabled={isLoading} // Nonaktifkan tombol saat loading
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Complete Booking"
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-4">
                    By clicking "Complete Booking", you agree to our terms and conditions
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;