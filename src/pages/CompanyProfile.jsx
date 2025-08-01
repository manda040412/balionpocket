import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

function CompanyProfile() {
  const [isCounting, setIsCounting] = useState(false);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true, margin: "-100px" });
  
  const galleryRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const controls = useAnimation();
  
  const milestones = [
    { value: 2016, label: "Established" },
    { value: 10000, label: "Happy Customers" },
    { value: 250, label: "Tour Packages" },
    { value: 50, label: "Local Partners" }
  ];
  
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1558005530-a7958896ec60",
      caption: "Exploring the sacred Uluwatu Temple"
    },
    {
      url: "https://images.unsplash.com/photo-1577717705920-9db5d985e1ae", 
      caption: "Unforgettable Tegallalang Rice Terraces"
    },
    {
      url: "https://images.unsplash.com/photo-1604999333679-b86d54738315", 
      caption: "Beautiful sunset at Tanah Lot"
    },
    {
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4", 
      caption: "Private tours to Nusa Penida"
    },
    {
      url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
      caption: "VIP airport transfers with our fleet"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  useEffect(() => {
    if (isInView && !isCounting) {
      setIsCounting(true);
    }
  }, [isInView, isCounting]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [galleryImages.length]);
  
  useEffect(() => {
    controls.start({
      x: `-${currentImageIndex * 100}%`,
      transition: { ease: "easeInOut", duration: 0.8 }
    });
  }, [currentImageIndex, controls]);
  
  return (
    <div className="bg-white min-h-screen pt-20"> {/* Added padding-top for navbar */}
      {/* About Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h2>
              <div className="w-20 h-2 bg-emerald-500 mb-8"></div>
              <p className="text-xl text-gray-700 mb-6">
                Established in 2016, Bali Corner Tour is more than just a transportation and tour service provider. We are a dedicated team of local Balinese experts passionate about showcasing the authentic beauty, rich cultural heritage, and hidden gems of our beloved island.
              </p>
              <p className="text-xl text-gray-700 mb-6">
                Our journey began with a simple vision: to provide visitors with unforgettable experiences that go beyond typical tourist attractions, connecting travelers with the true essence of Bali through personalized services and local expertise.
              </p>
              <p className="text-xl text-gray-700">
                From airport transfers to fully customized tour packages, we pride ourselves on attention to detail, professional service, and creating meaningful connections between our guests and the magical island of Bali.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="relative h-[500px] overflow-hidden rounded-xl shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1544550285-f813f6545bad" 
                alt="Bali Corner Tour" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                <p className="text-white text-xl font-medium">
                  Discover the authentic beauty of Bali with our local experts
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Our Mission & Vision
            </motion.h2>
            <motion.div variants={itemVariants} className="w-20 h-2 bg-emerald-500 mx-auto mb-12"></motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div 
                variants={itemVariants}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-700">
                  To provide exceptional travel experiences that showcase the authentic beauty of Bali while supporting local communities and preserving our cultural heritage. We strive to make every journey memorable through personalized service, attention to detail, and genuine Balinese hospitality.
                </p>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-700">
                  To become the most trusted name in Bali tourism, recognized globally for our commitment to sustainable and responsible travel practices. We envision a future where tourism enriches both visitors and local communities, creating lasting positive impacts while preserving the island's natural beauty for generations to come.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Milestones Counter Section */}
      <section 
        ref={countRef}
        className="py-24 bg-emerald-800 text-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Our Journey
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl max-w-2xl mx-auto">
              From our humble beginnings to becoming one of Bali's premier tour operators, 
              our journey has been filled with unforgettable moments and happy clients.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {milestones.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <CountUp 
                  end={item.value} 
                  isCounting={isCounting} 
                  className="text-5xl md:text-6xl font-bold mb-2" 
                />
                <p className="text-xl text-emerald-200">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Improved Gallery Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Explore Bali With Us
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the beauty of Bali through our curated experiences
            </motion.p>
          </motion.div>
          
          <div className="relative group">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={image.url} 
                      alt={image.caption}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <p className="text-white text-lg font-medium">{image.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

       {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Our Services
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive travel solutions for your perfect Bali experience
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Guided Tours</h3>
              <p className="text-gray-600 mb-6">
                From iconic temples to hidden waterfalls, our expertly guided tours showcase Bali's most spectacular attractions. Each tour is led by knowledgeable local guides who provide cultural insights and personalized experiences tailored to your interests.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cultural & Heritage Tours
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Adventure & Trekking Packages
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Beach & Island Hopping
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Airport Transfers</h3>
              <p className="text-gray-600 mb-6">
                Start your Bali experience with our professional and reliable airport transfer service. Our friendly drivers will greet you at the airport and ensure a comfortable journey to your accommodation, no matter where on the island you're staying.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Private & Shared Transfers
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  VIP & Luxury Options
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 Service Availability
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Car Rentals</h3>
              <p className="text-gray-600 mb-6">
                Explore Bali at your own pace with our reliable car rental service. Choose from a wide range of well-maintained vehicles, from compact cars to spacious vans, all with competitive pricing and flexible rental terms.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  With or Without Driver
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Daily & Weekly Rates
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Insurance Coverage Included
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              What Our Clients Say
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from travelers who have experienced Bali with us
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Bali Corner Tour made our vacation unforgettable! Our guide Ketut was incredibly knowledgeable about Balinese culture and took us to places we would never have found on our own.",
                author: "Sarah & Michael, Australia",
                rating: 5
              },
              {
                quote: "The airport transfer service was seamless - our driver was waiting with a sign when we arrived tired after a long flight. The car was spotless and the ride very comfortable.",
                author: "Thomas, Germany",
                rating: 5
              },
              {
                quote: "We booked a private tour to Ubud and it was worth every penny. Wayan customized the itinerary to our interests and pace. The best tour experience we've had anywhere!",
                author: "The Johnson Family, USA",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <p className="font-medium text-gray-800">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Explore Bali With Us?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contact us today to start planning your perfect Bali adventure. Our team is ready to create a customized itinerary just for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-white text-emerald-700 hover:bg-gray-100"
              >
                Book Now
              </Button>
              <Button
                size="lg" 
                className="text-lg px-8 py-6 bg-white text-emerald-700 hover:bg-gray-100"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function CountUp({ end, isCounting, className }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isCounting) return;
    
    const duration = 2000;
    const increment = end / (duration / 16);
    
    let currentCount = 0;
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(currentCount));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [end, isCounting]);
  
  return <span className={className}>{count.toLocaleString()}</span>;
}

export default CompanyProfile;