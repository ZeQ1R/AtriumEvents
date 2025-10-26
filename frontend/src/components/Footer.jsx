import React from "react";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy-green text-white py-12 px-4" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Eternal Bliss</h3>
            <p className="text-cream-100">
              Creating unforgettable wedding experiences with elegance and
              sophistication.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-cream-100 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-cream-100 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="text-cream-100 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#booking" className="text-cream-100 hover:text-white transition-colors">
                  Booking
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-cream-100">
              <li>123 Wedding Boulevard</li>
              <li>Dream City, DC 12345</li>
              <li>+1 (555) 123-4567</li>
              <li>hello@eternalbliss.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream-200/20 pt-8 text-center">
          <p className="flex items-center justify-center gap-2 text-cream-100">
            Made with <Heart className="w-4 h-4 fill-current" /> for your special
            day © 2025 Eternal Bliss. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;