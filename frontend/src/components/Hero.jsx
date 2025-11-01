import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-white to-green-50"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-navy-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cream-200/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-navy-green mb-6 leading-tight"
            data-testid="hero-title"
          >
            Your Dream Wedding
            <br />
            <span className="text-cream-600">Starts Here</span>
          </h1>
          <p
            className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            data-testid="hero-subtitle"
          >
            Creating unforgettable moments in the most elegant and sophisticated
            wedding venue. Where every detail matters and dreams come true.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#booking">
              <Button
                size="lg"
                className="bg-navy-green hover:bg-navy-green/90 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                data-testid="book-now-btn"
              >
                Book Your Date
              </Button>
            </a>
            <a href="#services">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-navy-green text-navy-green hover:bg-navy-green hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
                data-testid="explore-services-btn"
              >
                Explore Services
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        {/* <div
          className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <a href="#about" className="flex flex-col items-center animate-bounce">
            <span className="text-gray-500 text-sm mb-2">Scroll Down</span>
            <ChevronDown className="text-navy-green" size={32} />
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;