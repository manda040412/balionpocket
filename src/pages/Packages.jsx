import React, { useState, useEffect } from "react"
import DOMPurify from 'dompurify';
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"; // Import useToast untuk penanganan error

// Import API function
import { fetchTourPackages } from '../services/tourPackageApi';

function Packages() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Inisialisasi useToast
  const [filter, setFilter] = useState("all")
  const [packages, setPackages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [packageList, setPackageList] = useState(null);
  const [error, setError] = useState(null); // State untuk menangani error API

  const safe = html => ({ __html: DOMPurify.sanitize(html) });
  
  // --- START PERUBAHAN DI SINI UNTUK allPackages ---
  const allPackages = [
    {
      id: 1,
      title: "MOUNT BATUR SUNRISE VIEW",
      price: 110,
      description: "Experience breathtaking sunrise views from an active volcano. Includes: MIN 2 PAX, PANCAKE BREAKFAST, SUNRISE JEEP TOUR, BLACK LAVA, HOT SPRING, GUIDE & PHOTOGRAPHER.",
      // features array removed
      category: "adventure",
      image: "https://images.unsplash.com/photo-1604608672516-f1b9990afa14"
    },
    {
      id: 2,
      title: "BALI CULTURE TRIP",
      price: 90,
      description: "Immerse yourself in Balinese culture and traditions. Includes: MIN 2 PAX, BATUAN TEMPLE, MONKEY FOREST, JUNGLE SWING, RICE TERRACE, GOA GAJAH TEMPLE, COFFEE PLANTATION, INCLUDE ENTRANCE FEE.",
      // features array removed
      category: "cultural",
      image: "https://images.unsplash.com/photo-1542897644-e04428948020"
    },
    {
      id: 3,
      title: "GATE OF HEAVEN TRIP",
      price: 95,
      description: "Visit Bali's most iconic and spiritual locations. Includes: MIN 2 PAX, LEMPUYANG TEMPLE, TIRTA GANGGA, COFFEE BREAK, BALINESE SWING, GOA RAJA WATERFALL, INCLUDE ENTRANCE FEE.",
      // features array removed
      category: "cultural",
      image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f"
    },
    {
      id: 4,
      title: "UBUD TRIP",
      price: 75,
      description: "Discover the cultural heart of Bali in Ubud. Includes: MIN 2 PAX, BATIK FACTORY, SILVER FACTORY, BATUAN TEMPLE, RICE TERRACE, BALI SWING, MONKEY FOREST, INCLUDE ENTRANCE FEE.",
      // features array removed
      category: "cultural",
      image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47"
    },
    {
      id: 5,
      title: "JUNGLE ADVENTURE",
      price: 125,
      description: "Thrilling adventures through Bali's incredible jungles. Includes: MIN 2 PAX, ATV JUNGLE, BALI ZOO, RICE TERRACE, COFFEE PLANTATION, MONKEY FOREST, WATERFALL.",
      // features array removed
      category: "adventure",
      image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18"
    }
  ]
  // --- END PERUBAHAN DI SINI UNTUK allPackages ---

  // Effect untuk mengambil data paket tour dari API
  useEffect(() => {
    const getPackages = async () => {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const data = await fetchTourPackages();
        const transformedData = data?.length > 0 ? data?.map(pkg => {
          if (pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0) {
            return {
              ...pkg,
              description: `${pkg.description}. Includes: ${pkg.features.join(', ')}.`,
              features: undefined,
            };
          }
          return pkg;
        }) : [];
        setPackages(transformedData);

      } catch (err) {
        console.error("Error fetching tour packages:", err);
        setError("Failed to load tour packages. Please try again."); // Pesan error yang user-friendly
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load tour packages.",
          variant: "destructive",
        });
        setPackages(allPackages); // Fallback ke data lokal yang sudah digabungkan jika ada error API
      } finally {
        setIsLoading(false);
      }
    };

    getPackages();
  }, []); // Re-run effect jika toast berubah (jarang, tapi aman)

  const filteredPackages = filter === "all"
    ? packages
    : packages.filter(pkg => pkg.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[30vh] md:h-[40vh] overflow-hidden"
      >
        <img alt="Bali Packages" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl text-white"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">TOUR PAKET</h1>
              <p className="text-base md:text-xl">
                Discover curated experiences that showcase the best of Bali
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <Button
            variant={filter === "all" ? "default" : "outline"}
            className={`rounded-full px-6 ${filter === "all" ? "bg-teal-600 hover:bg-teal-700" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Experiences
          </Button>
          <Button
            variant={filter === "adventure" ? "default" : "outline"}
            className={`rounded-full px-6 ${filter === "adventure" ? "bg-teal-600 hover:bg-teal-700" : ""}`}
            onClick={() => setFilter("adventure")}
          >
            Adventure
          </Button>
          <Button
            variant={filter === "cultural" ? "default" : "outline"}
            className={`rounded-full px-6 ${filter === "cultural" ? "bg-teal-600 hover:bg-teal-700" : ""}`}
            onClick={() => setFilter("cultural")}
          >
            Cultural
          </Button>
        </motion.div>

        {/* Packages List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : error ? ( // Tampilkan pesan error jika ada
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4 text-red-600">{error}</h3>
            <p className="text-gray-600 mb-8">Please check your internet connection or try again later.</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="space-y-8">
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                onClick={() => navigate(`/package/${pkg.id}`)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 md:h-auto relative">
                    <img
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                      src={pkg.media_url || "https://via.placeholder.com/400x300"}
                    /> {/* Tambahkan fallback image */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="text-lg font-bold">${pkg.price_per_pax} USD</span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6 md:p-8">
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    {/* Menggunakan description yang sudah digabungkan */}
                    <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={safe(pkg.description)} />

                    {/* --- START PERUBAHAN DI SINI UNTUK MENGHAPUS FITUR --- */}
                    {/* Bagian ini dihapus karena fitur sudah digabung ke dalam deskripsi */}
                    {/*
                    <div className="space-y-2">
                      {pkg.features && pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-teal-600 mt-1">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    */}
                    {/* --- END PERUBAHAN DI SINI UNTUK MENGHAPUS FITUR --- */}

                    <Button
                      className="mt-6 bg-black hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah onClick pada div parent
                        navigate(`/package/${pkg.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // No Results
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No packages found</h3>
            <p className="text-gray-600 mb-8">Try changing your filter options or check back later.</p>
            {filter !== "all" && ( // Tampilkan tombol ini hanya jika filter tidak "all"
                <Button onClick={() => setFilter("all")}>View All Packages</Button>
            )}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-600 py-16 mt-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Contact our team for a personalized Bali experience tailored just for you
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white text-teal-600 hover:bg-gray-100"
              onClick={() => window.location.href = "mailto:info@balicornertour.com"}
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Packages;