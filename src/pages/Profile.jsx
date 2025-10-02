import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Package, ShoppingCart, LogOut } from "lucide-react";

// Import API functions
import { fetchUserProfile, updateUserProfile } from '../services/userApi';
import { logoutUser } from '../services/authApi'; // Pastikan ini diimpor dari authApi

function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Effect untuk memeriksa status login dan mengambil data profil/pesanan
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No auth token found, redirecting to login");
      setIsLoggedIn(false);
      navigate("/login");
      return;
    }
    setIsLoggedIn(true);

    const getUserProfile = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const profile = await fetchUserProfile();
        if (profile) {
          setUserName(profile.name || "User");
          setUserEmail(profile.email || "");
          localStorage.setItem("userName", profile.name || "User");
          localStorage.setItem("userEmail", profile.email || "");
        } else {
          // Handle case where API response is valid but data is null/empty
          setProfileError("No profile data found.");
          toast({
            title: "Error",
            description: "No profile data found from the server.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setProfileError(err.response?.data?.message || "Failed to load user profile. Check API endpoint.");
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const getUserOrders = async () => {
      setIsLoadingOrders(true);
      setOrdersError(null);
      try {
        const userOrders = await fetchUserOrders();
        if (userOrders) {
          setOrders(userOrders);
        } else {
          setOrders([]); // Set orders to empty array if response is null
        }
      } catch (err) {
        console.error("Error fetching user orders:", err);
        setOrdersError(err.response?.data?.message || "Failed to load your orders. Check API endpoint.");
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

  }, []); // Tambahkan toast ke dependencies

  const handleUpdateProfile = async () => {
    try {
      // Hanya kirim data yang bisa diubah (nama)
      await updateUserProfile({ username: userName });
      toast({
        title: "Profile updated",
        description: "Your information has been updated successfully",
      });
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

  const handleSignOut = async () => {
    try {
      await logoutUser();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (err) {
      console.error("API Logout failed, but proceeding with client-side logout:", err);
      toast({
        title: "Sign Out Issue",
        description: "There was an issue with API logout, but you are logged out from this device.",
        variant: "destructive"
      });
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("redirectAfterLogin");
      window.dispatchEvent(new Event('storage'));
      navigate("/");
    }
  };

  // Tampilkan loading state atau redirect jika tidak login
  if (!isLoggedIn || isLoadingProfile) {
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
  if (profileError) {
      return (
          <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Data</h2>
                  <p className="text-gray-600 mb-4">{profileError}</p>
                  <Button onClick={() => window.location.reload()}>Reload Page</Button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div
          className="mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-primary rounded-3xl p-8 shadow-lg text-white mb-8">
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
                      variant="default"
                      className="w-full justify-start text-left"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => navigate("/order-list")}
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
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleUpdateProfile} // Panggil fungsi API
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
