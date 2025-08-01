import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, Clock, Calendar, Users, Plane, MapPin } from "lucide-react";

// Import API functions
import { fetchCartItems, updateCartItemQuantity, removeCartItem, clearUserCart } from '../services/cartApi';

function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk memuat item keranjang dari API
  const loadCartFromApi = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCartItems();
      setCartItems(data);
    } catch (err) {
      console.error("Error loading cart items:", err);
      setError("Failed to load cart items. Please try again.");
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load your cart.",
        variant: "destructive",
      });
      setCartItems([]); // Kosongkan keranjang jika gagal
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartFromApi(); // Muat keranjang saat komponen pertama kali dirender
  }, []);

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Mengupdate kuantitas item melalui API
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    // Optimistic UI update
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      await updateCartItemQuantity(itemId, newQuantity);
      // Jika berhasil, tidak perlu update state lagi karena sudah optimistic
      // Jika ada kebutuhan untuk sinkronisasi ulang, bisa panggil loadCartFromApi()
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast({
        title: "Update Failed",
        description: err.response?.data?.message || "Failed to update item quantity. Please refresh.",
        variant: "destructive",
      });
      // Rollback optimistic update jika gagal
      loadCartFromApi();
    }
  };

  // Menghapus item dari keranjang melalui API
  const handleRemoveItem = async (itemId) => {
    // Optimistic UI update
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

    try {
      await removeCartItem(itemId);
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart"
      });
    } catch (err) {
      console.error("Error removing item:", err);
      toast({
        title: "Removal Failed",
        description: err.response?.data?.message || "Failed to remove item. Please refresh.",
        variant: "destructive",
      });
      // Rollback optimistic update jika gagal
      loadCartFromApi();
    }
  };

  // Mengosongkan seluruh keranjang melalui API
  const handleClearCart = async () => {
    // Optimistic UI update
    setCartItems([]);

    try {
      await clearUserCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart"
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast({
        title: "Clear Cart Failed",
        description: err.response?.data?.message || "Failed to clear cart. Please refresh.",
        variant: "destructive",
      });
      // Rollback optimistic update jika gagal
      loadCartFromApi();
    }
  };

  // Logika checkout (melanjutkan ke halaman checkout)
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    // `currentOrder` yang disimpan di localStorage harus berisi data yang relevan untuk halaman checkout
    // Idealnya, halaman checkout akan mengambil ulang data dari backend berdasarkan ID order yang dibuat
    // atau menggunakan data yang sudah ada di cartItems.
    // Untuk saat ini, kita akan teruskan cartItems ke localStorage seperti sebelumnya.
    localStorage.setItem("currentOrder", JSON.stringify({
      items: cartItems,
      total: cartTotal,
      date: new Date().toISOString()
    }));

    navigate("/checkout");
  };

  // Helper function untuk format tanggal (tidak berubah)
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Date not specified";
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Invalid date"
        : date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Komponen pembantu untuk menampilkan detail booking (tidak berubah signifikan, disesuaikan dengan struktur item API)
  const BookingDatesDisplay = ({ bookingDates, type }) => {
    if (!bookingDates) {
      return (
        <div className="text-sm text-gray-500">
          No booking dates specified
        </div>
      );
    }

    // Pastikan properti yang diakses sesuai dengan respons API Anda
    // Misalnya, jika API mengembalikan car rental dengan `startDate` dan `endDate`
    // atau airport transfer dengan `pickupDate` dan `pickupTime`
    // Sesuaikan kondisi di bawah ini.
    // Saya akan menjaga struktur dummy yang ada, tapi penting untuk diverifikasi.

    if (bookingDates.start && bookingDates.end) { // Misalnya untuk Tour Package atau Car Rental
      return (
        <div className="flex items-center text-sm text-gray-700 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {formatDate(bookingDates.start)} - {formatDate(bookingDates.end)}
          </span>
        </div>
      );
    }

    if (bookingDates.date) { // Misalnya untuk Airport Transfer
      return (
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(bookingDates.date)}</span>
          </div>
          {bookingDates.time && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{bookingDates.time}</span>
            </div>
          )}
          {bookingDates.arrivalTime && bookingDates.departureTime && (
            <>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Arrival: {bookingDates.arrivalTime}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Departure: {bookingDates.departureTime}</span>
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-500">
        No specific booking dates available for this item type.
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[20vh] md:h-[25vh] overflow-hidden"
      >
        <img
          alt="Shopping Cart"
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1570337798961-2bed5b43be04"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl text-white"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-2">Your Cart</h1>
              <p className="text-base md:text-xl">
                Review your selected services before checkout
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Cart Items ({cartItems.length})</h2>
                    <Button
                      variant="outline"
                      onClick={handleClearCart} // Panggil fungsi API
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      Clear Cart
                    </Button>
                  </div>

                  {/* Cart Items List */}
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 h-48 sm:h-auto relative">
                          <img
                            alt={item.title}
                            className="w-full h-full object-cover"
                            src={item.image || "/api/placeholder/400/300"}
                          />
                          <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
                            {item.type}
                          </div>
                        </div>
                        <div className="sm:w-2/3 p-6">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <button
                              onClick={() => handleRemoveItem(item.id)} // Panggil fungsi API
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                          <p className="text-gray-600 mb-4">{item.description}</p>

                          {/* Booking Dates Section */}
                          <div className="mb-4">
                            <BookingDatesDisplay
                              bookingDates={item.bookingDates}
                              type={item.type}
                            />
                          </div>

                          {/* Service Details Section */}
                          {/* Pastikan `item.details` berisi properti yang sesuai dengan data dari API */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* People count */}
                            {item.details?.people && (
                              <div className="flex items-center text-sm text-gray-700">
                                <Users className="w-4 h-4 mr-2" />
                                <span>{item.details.people} {item.details.people > 1 ? 'People' : 'Person'}</span>
                              </div>
                            )}

                            {/* Flight numbers */}
                            {item.details?.flightNumber && (
                              <div className="flex items-center text-sm text-gray-700">
                                <Plane className="w-4 h-4 mr-2" />
                                <span>Flight: {item.details.flightNumber}</span>
                              </div>
                            )}

                            {item.details?.arrivalFlight && (
                              <div className="flex items-center text-sm text-gray-700">
                                <Plane className="w-4 h-4 mr-2" />
                                <span>Arrival Flight: {item.details.arrivalFlight}</span>
                              </div>
                            )}

                            {item.details?.departureFlight && (
                              <div className="flex items-center text-sm text-gray-700">
                                <Plane className="w-4 h-4 mr-2" />
                                <span>Departure Flight: {item.details.departureFlight}</span>
                              </div>
                            )}

                            {/* Terminal */}
                            {item.details?.terminal && (
                              <div className="flex items-center text-sm text-gray-700">
                                <span>Terminal: {item.details.terminal}</span>
                              </div>
                            )}

                            {/* Dropoff address */}
                            {item.details?.dropoffAddress && (
                              <div className="flex items-start text-sm text-gray-700 col-span-2">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                <span>Dropoff: {item.details.dropoffAddress}</span>
                              </div>
                            )}

                            {/* Activities */}
                            {item.details?.activities && (
                              <div className="col-span-2">
                                <p className="text-sm font-medium mb-1">Activities:</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.details.activities.map((activity, index) => (
                                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                                      {activity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} // Panggil fungsi API
                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-medium text-lg min-w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} // Panggil fungsi API
                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <p className="font-bold text-xl">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary Section */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md p-6 sticky top-24"
                  >
                    <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      size="lg"
                      className="w-full text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl transition-all transform hover:scale-[1.02]"
                    >
                      Proceed to Checkout
                    </Button>

                    <div className="mt-6 space-y-4">
                      <h3 className="font-medium">Accepted Payment Methods</h3>
                      <div className="flex gap-2">
                        <div className="p-2 bg-gray-100 rounded">
                          <span className="text-xl">💳</span>
                        </div>
                        <div className="p-2 bg-gray-100 rounded">
                          <span className="text-xl">🅿️</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto"
                >
                  <div className="mb-6 text-6xl">🛒</div>
                  <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                  <p className="text-gray-600 mb-8">
                    Browse our amazing services and add some items to your cart
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => navigate("/packages")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Packages
                    </Button>
                    {/* Hapus atau nonaktifkan tombol Load Dummy Data jika sudah full API */}
                    {/* <Button
                      size="lg"
                      variant="outline"
                      onClick={loadDummyData}
                      className="border-gray-300 hover:bg-gray-100"
                    >
                      Load Demo Cart
                    </Button> */}
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>

      {/* You might also like section - If this data is also dynamic, fetch from API */}
      {!isLoading && cartItems.length > 0 && (
        <section className="bg-gray-100 py-16 mt-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">You Might Also Like</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "rec1", title: "VIP Airport Fast Track", price: 45, description: "Expedited immigration and customs clearance", image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd" },
                { id: "rec2", title: "Luggage Storage Service", price: 15, description: "Secure storage for your luggage during transit", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12" },
                { id: "rec3", title: "Private City Tour", price: 90, description: "Explore the city during your long layover", image: "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4" }
              ].map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  onClick={() => navigate(`/package/${recommendation.id}`)}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      alt={recommendation.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      src={recommendation.image}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1">
                      <span className="font-bold">${recommendation.price}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{recommendation.title}</h3>
                    <p className="text-gray-600 mb-4">{recommendation.description}</p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/package/${recommendation.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Cart;