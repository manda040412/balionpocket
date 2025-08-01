import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Package, ShoppingCart, LogOut } from "lucide-react";

// Import API functions
import { fetchUserProfile, updateUserProfile, fetchUserOrders } from '../services/userApi';
import { logoutUser } from '../services/authApi'; // Pastikan ini diimpor dari authApi

function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);

  // Effect untuk memeriksa status login dan mengambil data profil/pesanan
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Menggunakan 'authToken' untuk cek login
    if (!token) {
      console.log("No auth token found, redirecting to login");
      setIsLoggedIn(false); // Pastikan state isLoggedIn false
      navigate("/login");
      return;
    }
    setIsLoggedIn(true);

    // Fetch User Profile
    const getUserProfile = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const profile = await fetchUserProfile();
        setUserName(profile.name || "User");
        setUserEmail(profile.email || "");
        // Update localStorage juga, agar Navbar bisa update
        localStorage.setItem("userName", profile.name || "User");
        localStorage.setItem("userEmail", profile.email || "");
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setProfileError(err.response?.data?.message || "Failed to load user profile.");
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    // Fetch User Orders
    const getUserOrders = async () => {
      setIsLoadingOrders(true);
      setOrdersError(null);
      try {
        const userOrders = await fetchUserOrders();
        setOrders(userOrders);
      } catch (err) {
        console.error("Error fetching user orders:", err);
        setOrdersError(err.response?.data?.message || "Failed to load your orders.");
        toast({
          title: "Error",
          description: "Failed to load order history.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingOrders(false);
      }
    };

    getUserProfile();
    getUserOrders();

  }, [navigate, toast]); // Tambahkan toast ke dependencies

  // Handle Update Profile
  const handleUpdateProfile = async () => {
    try {
      // Hanya kirim data yang bisa diubah (nama)
      await updateUserProfile({ name: userName });
      toast({
        title: "Profile updated",
        description: "Your information has been updated successfully",
      });
      // Memicu event storage agar Navbar bisa update nama jika perlu
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Update Failed",
        description: err.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      // Panggil API logout jika backend Anda membutuhkannya
      await logoutUser();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (err) {
      // Walaupun ada error dari API logout, kita tetap hapus token dari frontend
      console.error("API Logout failed, but proceeding with client-side logout:", err);
      toast({
        title: "Sign Out Issue",
        description: "There was an issue with API logout, but you are logged out from this device.",
        variant: "destructive"
      });
    } finally {
      // Hapus semua data login dari localStorage
      localStorage.removeItem("authToken"); // Hapus token utama
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("redirectAfterLogin"); // Bersihkan juga ini

      // Memicu event storage agar Navbar/komponen lain update status login
      window.dispatchEvent(new Event('storage'));
      navigate("/"); // Redirect ke halaman utama atau login page
    }
  };

  // Tampilkan loading state atau redirect jika tidak login
  if (!isLoggedIn || isLoadingProfile || isLoadingOrders) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          {isLoggedIn ? (
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          ) : (
            <p>Redirecting to login...</p>
          )}
        </div>
      </div>
    );
  }

  // Tampilkan error jika gagal memuat profil atau pesanan
  if (profileError || ordersError) {
      return (
          <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Data</h2>
                  <p className="text-gray-600 mb-4">{profileError || ordersError}</p>
                  <Button onClick={() => window.location.reload()}>Reload Page</Button>
              </div>
          </div>
      );
  }


  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-lg text-white mb-8">
            <div className="flex items-center">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center text-4xl">
                <User size={40} />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">{userName}</h1>
                <p className="text-white/80">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Sidebar - Actions */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Account</h2>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => navigate("/orders")}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => navigate("/cart")}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Cart
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start text-left mt-8"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Info */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">My Details</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      // onChange={(e) => setUserEmail(e.target.value)} // Email biasanya tidak bisa diubah
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                      disabled // Nonaktifkan input email karena tidak bisa diubah
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleUpdateProfile} // Panggil fungsi API
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>

                {/* Recent Orders Section */}
                {orders.length > 0 ? (
                  <div className="mt-10">
                    <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => ( // Tidak perlu index sebagai key jika ada ID unik
                        <div
                          key={order.id || JSON.stringify(order)} // Gunakan order.id jika ada, fallback ke JSON.stringify
                          className="border rounded-xl p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{order.title}</h4>
                              <p className="text-sm text-gray-600">
                                {/* Asumsi order.date ada dan bisa di-parse */}
                                Date: {new Date(order.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                Guests: {order.quantity || order.passengers || 1} {/* Sesuaikan properti untuk jumlah orang */}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${order.total}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {orders.length > 3 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/orders")}
                        >
                          View All Orders
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                    <div className="mt-10 text-center text-gray-600">
                        <p>No recent orders found.</p>
                        <Button variant="link" onClick={() => navigate("/packages")}>Start exploring packages!</Button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;