import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);

    // Array gambar gallery dari gallery1 hingga gallery25
    const galleryImages = [
        { id: 1, url: "/img/gallery1.jpeg", title: "Bali Waterfall" },
        { id: 2, url: "/img/gallery2.jpeg", title: "Temple View" },
        { id: 3, url: "/img/gallery3.jpeg", title: "Rice Terraces" },
        { id: 4, url: "/img/gallery4.jpeg", title: "Beach Sunset" },
        { id: 5, url: "/img/gallery5.jpeg", title: "Traditional Dance" },
        { id: 6, url: "/img/gallery6.jpeg", title: "Green Valley" },
        { id: 7, url: "/img/gallery7.jpeg", title: "Forest Path" },
        { id: 8, url: "/img/gallery8.jpeg", title: "Coastal Cliffs" },
        { id: 9, url: "/img/gallery9.jpeg", title: "Rice Fields" },
        { id: 10, url: "/img/gallery10.jpeg", title: "Golden Hour" },
        { id: 11, url: "/img/gallery11.jpeg", title: "Stone Balance" },
        { id: 12, url: "/img/gallery12.jpeg", title: "Temple Statue" },
        { id: 13, url: "/img/gallery13.jpeg", title: "Garden Temple" },
        { id: 14, url: "/img/gallery14.jpeg", title: "Temple Grounds" },
        { id: 15, url: "/img/gallery15.jpeg", title: "Ancient Pillars" },
        { id: 16, url: "/img/gallery16.jpeg", title: "Water Temple" },
        { id: 17, url: "/img/gallery17.jpeg", title: "Traditional Architecture" },
        { id: 18, url: "/img/gallery18.jpeg", title: "Sacred Temple" },
        { id: 19, url: "/img/gallery19.jpeg", title: "Balinese Culture" },
        { id: 20, url: "/img/gallery20.jpeg", title: "Temple Entrance" },
        { id: 21, url: "/img/gallery21.jpeg", title: "Holy Place" },
        { id: 22, url: "/img/gallery22.jpeg", title: "Water Garden" },
        { id: 24, url: "/img/gallery24.jpeg", title: "Sacred Pond" },
        { id: 25, url: "/img/gallery25.jpeg", title: "Fire Dance" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Gallery</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore the beauty of Bali through our curated collection of memorable moments
                    </p>
                    <div className="w-24 h-1 bg-emerald-500 mx-auto mt-6"></div>
                </motion.div>

                {/* Gallery Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group"
                            onClick={() => setSelectedImage(image)}
                        >
                            <div className="aspect-square">
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Lightbox Modal */}
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="max-w-5xl max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.title}
                                className="w-full h-full object-contain rounded-lg"
                            />
                            <div className="text-center mt-4">
                                <h3 className="text-white text-2xl font-semibold">{selectedImage.title}</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Gallery;