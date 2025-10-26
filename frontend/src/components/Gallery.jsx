import React, { useState } from "react";
import { X } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
  ];

  return (
    <section
      id="gallery"
      className="py-20 px-4 bg-white relative overflow-hidden"
      data-testid="gallery-section"
    >
      <div className="absolute top-20 right-10 w-96 h-96 bg-cream-100/50 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-green mb-4"
            data-testid="gallery-title"
          >
            Our Beautiful Weddings
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" data-testid="gallery-description">
            A glimpse into the magical moments we've helped create for couples
            just like you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
              onClick={() => setSelectedImage(image)}
              data-testid={`gallery-image-${index}`}
            >
              <img
                src={image}
                alt={`Wedding ${index + 1}`}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-green/80 via-navy-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                <span className="text-white font-semibold text-lg">View Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          data-testid="lightbox-modal"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
            data-testid="close-lightbox-btn"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Selected wedding"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;