import React, { useRef, useEffect, useState } from "react"; // Tambahkan useState
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import { useToast } from "@/components/ui/use-toast"; // Tambahkan useToast untuk penanganan error

// Import API functions
import { fetchTourPackages } from '../services/tourPackageApi';
import { fetchAirportTransitDestinations } from '../services/airportTransitApi';
import { fetchAvailableCars } from '../services/carRentalApi';

function Home() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Inisialisasi useToast
  const testimonialsRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Gunakan useState
  const [tourPackages, setTourPackages] = useState([]);
  const [airportTransfers, setAirportTransfers] = useState([]);
  const [carRentals, setCarRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const safe = html => ({ __html: DOMPurify.sanitize(html) });

  const totalTestimonials = 4; // Tetap statis untuk saat ini

  // Testimonials (tetap statis untuk saat ini, bisa di-API-kan nanti)
  const testimonials = [
    { id: 1, name: "Sophia", country: "United Kingdom", text: "Bali Corner Tour made exploring Bali so easy and enjoyable! The guide was friendly, knowledgeable, and took us to incredible spots we would've never found on our own. Every stop felt perfectly planned. Highly recommended for anyone visiting Bali!", rating: 5 },
    { id: 2, name: "Mark", country: "Australia", text: "The Nusa Penida tour was simply breathtaking! The crystal-clear waters and stunning cliffs were out of this world. Everything was well-coordinated, from the fast boat to the guided island tour. I'd recommend Bali Corner Tour to anyone who wants to see the real beauty of Bali!", rating: 5 },
    { id: 3, name: "Emily", country: "Canada", text: "The airport transfer was smooth and hassle-free. The driver was punctual, courteous, and made us feel welcome from the moment we arrived. A perfect start to our Bali trip!", rating: 5 },
    { id: 4, name: "Jake", country: "Australia", text: "What an adrenaline-packed day! From ATV rides through the jungle to river rafting, it was nonstop fun. Bali Corner Tour organized everything seamlessly, and the team was super professional. I can't wait to try another adventure with them!", rating: 5 }
  ];

  // Effect untuk auto-scrolling testimonials (tetap seperti semula)
  useEffect(() => {
    const testimonialsEl = testimonialsRef.current;
    if (!testimonialsEl) return;

    let scrollInterval;
    let isHovering = false;
    let scrollIndex = 0;
    const cardWidth = 320; // Sesuaikan jika lebar card berbeda

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (!isHovering && testimonialsEl) {
          scrollIndex = (scrollIndex + 1) % totalTestimonials; // Gunakan totalTestimonials yang statis
          setCurrentIndex(scrollIndex);

          testimonialsEl.scrollTo({
            left: scrollIndex * cardWidth,
            behavior: 'smooth'
          });

          if (scrollIndex === totalTestimonials - 1) {
            setTimeout(() => {
              if (!isHovering) {
                testimonialsEl.scrollTo({
                  left: 0,
                  behavior: 'auto'
                });
                scrollIndex = 0;
                setCurrentIndex(0);
              }
            }, 3000);
          }
        }
      }, 4000);
    };

    const initialTimer = setTimeout(() => {
      startScrolling();
    }, 1000);

    testimonialsEl.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    testimonialsEl.addEventListener('mouseleave', () => {
      isHovering = false;
    });

    return () => {
      clearInterval(scrollInterval);
      clearTimeout(initialTimer);
    };
  }, []);


  // Effect untuk mengambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [tourRes, airportRes, carRes] = await Promise.all([
          fetchTourPackages(),
          fetchAirportTransitDestinations(),
          fetchAvailableCars()
        ]);

        console.log(tourRes)

        // Ambil hanya 3-4 item pertama jika ingin menampilkan "featured" saja
        setTourPackages(tourRes?.length > 0 ? tourRes.slice(0, 3) : []); // Ambil 3 paket tur pertama
        setAirportTransfers(airportRes?.length > 0 ? airportRes.slice(0, 3) : []); // Ambil 3 transfer pertama
        setCarRentals(carRes?.length > 0 ? carRes.slice(0, 2) : []); // Ambil 2 mobil pertama

      } catch (err) {
        console.error("Error fetching data for home page:", err);
        setError("Failed to load content. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load home page content.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{error}</h2>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img alt="Bali landscape" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1555865137-2c43512120e5" />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">Discover Bali</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Experience the island of gods through carefully curated journeys
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/50"
              onClick={() => navigate("/packages")}
            > {/* Navigasi ke halaman daftar paket */}
              Begin Your Journey
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce text-white text-4xl">↓</div>
        </motion.div>
      </section>

      {/* Tour Package Section (formerly Curated Experiences) */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Tour Package</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Each journey is thoughtfully designed to reveal Bali's hidden treasures
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tourPackages.map((pkg, index) => ( // Render dari state tourPackages
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group relative overflow-hidden rounded-3xl"
              >
                <img alt={pkg.title} className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110" src={pkg.media_url || "https://images.unsplash.com/photo-1580213844993-bc57a990daee"} /> {/* Gunakan pkg.image jika ada */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-gray-300 mb-4" dangerouslySetInnerHTML={safe(pkg.description)} />
                  <p className="text-2xl font-bold">${pkg.price_per_pax}</p>
                  <Button
                    className="mt-4 bg-white/20 backdrop-blur-md hover:bg-white/30"
                    onClick={() => navigate(`/package/${pkg.id}`)}
                  >
                    Explore
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/50"
              onClick={() => navigate("/packages")}
            >
              View All Tour Packages
            </Button>
          </div>
        </div>
      </section>

      {/* Jenis Transportasi Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Jenis Transportasi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pilihan transportasi nyaman dan handal untuk perjalanan Anda di Bali
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {airportTransfers.map((transfer, index) => ( // Render dari state airportTransfers
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img alt={transfer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={transfer.media_url || "https://images.unsplash.com/photo-1506096023343-0e398a0593e1"} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 drop-shadow-lg">
                    <span className="text-lg font-bold">${transfer.price}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{transfer.name}</h3>
                  <p className="text-gray-600 mb-4">{transfer.description || "Description placeholder here if needed."}</p> {/* Perlu dicek */}
                  <div className="flex items-center mb-6">
                    <span className="text-sm font-medium bg-gray-100 rounded-full px-4 py-1">{transfer.duration}</span> {/* Perlu dicek */}
                  </div>
                  {/* Display max passengers for airport transfer */}
                  {/* Perlu dicek */}
                  {transfer.maxPassengers && <p className="text-sm text-gray-600 mb-2">Max. {transfer.maxPassengers} passengers</p>}
                  <p className="text-sm text-emerald-600 mb-6">{transfer.highlight}</p> {/* Perlu dicek */}
                  <Button
                    className="w-full bg-black hover:bg-gray-800"
                    onClick={() => navigate("/airport-transit")}
                  >
                    Book Transfer
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gray-900 hover:bg-gray-800"
              onClick={() => navigate("/airport-transit")}
            >
              View All Transportation Options
            </Button>
          </div>
        </div>
      </section>

      {/* Car Rental Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Car Rental</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore Bali at your own pace with our comfortable rental vehicles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {carRentals.map((car, index) => ( // Render dari state carRentals
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img alt={car.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={car.media_url || "/api/placeholder/400/300"} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 drop-shadow-lg">
                    <span className="text-lg font-bold">${car.price_per_day}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{car.name || "Car name here"}</h3>
                  <p className="text-gray-600 mb-4">{car.description || "Description placeholder here."}</p>
                  <div className="flex items-center mb-6">
                    <span className="text-sm font-medium bg-gray-100 rounded-full px-4 py-1">{car.duration_per_day}</span>
                  </div>
                  {/* Display "For Groups Only" for Van Car */}
                  {/* Perlu dicek */}
                  {car.isGroupOnly && (
                    <p className="text-sm text-red-600 mb-2 font-semibold">Khusus Grup</p>
                  )}
                  <p className="text-sm text-emerald-600 mb-6">{car.highlight}</p> {/* Perlu dicek */}
                  <Button
                    className="w-full bg-black hover:bg-gray-800"
                    onClick={() => navigate("/car-detail")}
                  > {/* Mengarahkan ke halaman car-detail utama */}
                    Rent Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gray-900 hover:bg-gray-800"
              onClick={() => navigate("/car-detail")}
            > {/* Mengarahkan ke halaman car-detail utama */}
              View All Car Rentals
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Updated with horizontal scrolling */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Guest Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Authentic experiences shared by our valued guests
            </p>
          </motion.div>

          {/* Horizontal scrolling container */}
          <div
            ref={testimonialsRef}
            className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-full md:w-96 snap-center"
                style={{ minWidth: '320px', scrollSnapAlign: 'center' }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4">
                    <img
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      src={`/api/placeholder/${160}/${160}?text=${testimonial.name.charAt(0)}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.country}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`mx-1 w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex % totalTestimonials ? 'bg-gray-600' : 'bg-gray-300 hover:bg-gray-500'
                }`}
                onClick={() => {
                  if (testimonialsRef.current) {
                    const scrollAmount = index * 320;
                    testimonialsRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: 'smooth'
                    });
                    setCurrentIndex(index);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 overflow-hidden">
        <img alt="Bali sunset" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1620385928979-31c23ab026b0" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your Bali Journey Awaits
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let us create your perfect Bali experience
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100"
              onClick={() => navigate("/packages")}
            >
              Start Planning
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;