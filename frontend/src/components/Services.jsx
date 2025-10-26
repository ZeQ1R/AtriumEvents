import React from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const Services = () => {
  const services = [
    {
      name: "Classic Package",
      price: "$5,000",
      features: [
        "Elegant venue decoration",
        "Professional wedding coordination",
        "Catering for up to 100 guests",
        "Sound system & lighting",
        "Bridal suite access",
      ],
    },
    {
      name: "Premium Package",
      price: "$8,500",
      featured: true,
      features: [
        "Luxury venue transformation",
        "Dedicated event planning team",
        "Gourmet catering for up to 200 guests",
        "Premium AV & stage lighting",
        "Bridal & groom suites",
        "Complimentary engagement photoshoot",
        "Wedding rehearsal coordination",
      ],
    },
    {
      name: "Exclusive Package",
      price: "$15,000",
      features: [
        "Complete venue customization",
        "Full-service wedding planning",
        "Premium catering for unlimited guests",
        "State-of-the-art production",
        "Luxury suites with spa services",
        "Professional photography & videography",
        "Live entertainment coordination",
        "Post-wedding brunch included",
      ],
    },
  ];

  return (
    <section
      id="services"
      className="py-20 px-4 bg-gradient-to-br from-cream-50 via-white to-green-50 relative overflow-hidden"
      data-testid="services-section"
    >
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-green/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-green mb-4"
            data-testid="services-title"
          >
            Wedding Packages
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" data-testid="services-description">
            Choose the perfect package for your special day. Each designed to
            create unforgettable memories.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`p-8 rounded-3xl transform hover:-translate-y-2 transition-all duration-500 ${
                service.featured
                  ? "border-4 border-navy-green shadow-2xl scale-105 bg-white"
                  : "border-2 border-gray-200 shadow-lg bg-white hover:border-navy-green"
              }`}
              data-testid={`service-card-${index}`}
            >
              {service.featured && (
                <div className="text-center mb-4">
                  <span className="inline-block bg-navy-green text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-navy-green mb-2" data-testid={`service-name-${index}`}>
                  {service.name}
                </h3>
                <div className="text-4xl font-bold text-gray-800 mb-2" data-testid={`service-price-${index}`}>
                  {service.price}
                </div>
                <p className="text-gray-500 text-sm">Starting from</p>
              </div>
              <ul className="space-y-4 mb-8">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3" data-testid={`service-feature-${index}-${fIndex}`}>
                    <div className="mt-1 flex-shrink-0">
                      <Check className="w-5 h-5 text-navy-green" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#booking" className="block">
                <button
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                    service.featured
                      ? "bg-navy-green text-white hover:bg-navy-green/90 shadow-lg hover:shadow-xl"
                      : "border-2 border-navy-green text-navy-green hover:bg-navy-green hover:text-white"
                  }`}
                  data-testid={`select-package-btn-${index}`}
                >
                  Select Package
                </button>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;