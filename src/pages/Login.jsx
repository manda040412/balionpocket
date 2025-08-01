import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
// import { config } from "../lib/constants"; // Hapus ini, tidak diperlukan lagi

// Import API functions
import { loginUser, registerUser } from '../services/authApi';

function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [redirectPath, setRedirectPath] = useState("/");

  // `baseUrl` dari config.js tidak lagi diperlukan karena apiClient mengelolanya.
  // Jika Anda memiliki URL otentikasi pihak ketiga (seperti Google OAuth) yang tidak melalui apiClient,
  // Anda bisa mendapatkannya dari environment variable (misal: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL).
  const googleAuthUrl = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google` : 'http://localhost:8080/auth/google'; // Contoh: ganti dengan URL Google OAuth backend Anda

  useEffect(() => {
    const storedRedirectPath = localStorage.getItem("redirectAfterLogin");
    if (storedRedirectPath) {
      setRedirectPath(storedRedirectPath);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submit button clicked");

    if (!email || !password || (isRegistering && !name)) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to continue",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
        duration: 3000 // Durasi lebih pendek untuk validasi
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (isRegistering) {
        response = await registerUser({ name, email, password });
        toast({
          title: "Account created",
          description: "Welcome to Bali Corner Tour! You are now logged in.",
        });
      } else {
        response = await loginUser({ email, password });
        toast({
          title: "Welcome back",
          description: "You've successfully logged in to your account",
        });
      }

      // Asumsi API mengembalikan { token: "...", user: { id, name, email } }
      // Simpan token yang diterima dari backend ke localStorage dengan kunci 'authToken'
      localStorage.setItem("authToken", response.token); // Kunci 'authToken' sesuai apiClient Julius
      localStorage.setItem("isLoggedIn", "true"); // Tetap pertahankan ini untuk kemudahan cek di Navbar/UI
      localStorage.setItem("userName", response.user.name || name || email); // Ambil dari response, fallback ke input
      localStorage.setItem("userEmail", response.user.email || email);

      // Memicu event storage agar Navbar atau komponen lain yang mendengarkan bisa update
      window.dispatchEvent(new Event('storage'));

      const redirectTo = redirectPath && redirectPath !== "/login" ? redirectPath : "/"; // Hindari redirect kembali ke /login
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo);

    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: error.response?.data?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Bali theme */}
      <div className="absolute inset-0">
        <img
          alt="Bali landscape"
          className="w-full h-full object-cover"
          src="/img/bg_login.jpg" // Pastikan gambar ini ada di folder /public/img
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            {/* Bali-themed header */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-4"
              >
                {isRegistering ? "Join Our Bali Journey" : "Welcome to Bali"}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/90"
              >
                {isRegistering
                  ? "Create your account to explore Bali's wonders"
                  : "Sign in to continue your Bali adventure"}
              </motion.p>

              {redirectPath !== "/" && redirectPath !== "/login" && ( // Tampilkan pesan redirect hanya jika ada path yang disimpan
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 text-amber-300"
                >
                  Please log in to continue with your booking
                </motion.p>
              )}
            </div>

            {/* Form with Bali-inspired styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20"
            >
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {isRegistering && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-white mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-white focus:border-white focus:bg-white/30"
                        placeholder="Your full name"
                        required
                      />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-white mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-white focus:border-white focus:bg-white/30"
                      placeholder="your.email@example.com"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-white mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-white focus:border-white focus:bg-white/30"
                      placeholder="••••••••"
                      required
                    />
                  </motion.div>

                  {!isRegistering && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-end"
                    >
                      <button
                        type="button"
                        className="text-sm text-white/80 hover:text-white"
                      >
                        Forgot password?
                      </button>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      type="submit"
                      className="w-full text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-xl shadow-lg"
                      disabled={isLoading}
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
                        isRegistering ? "Create Account" : "Sign In"
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 pt-6 border-t border-white/20 text-center"
                >
                  <p className="text-white/80">
                    {isRegistering
                      ? "Already have an account?"
                      : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      className="text-white font-medium hover:text-emerald-300"
                      onClick={() => setIsRegistering(!isRegistering)}
                    >
                      {isRegistering ? "Sign In" : "Create Account"}
                    </button>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-white/70">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <a
                      href={googleAuthUrl} // Menggunakan URL Google OAuth dari env
                      type="button"
                      className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 border border-white/20 rounded-xl shadow-sm text-sm font-medium transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;