import React from "react";
import { Heart, Award, Users, Sparkles } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Passionate Team",
      description: "Dedicated professionals who care about your special day",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in wedding services",
    },
    {
      icon: Users,
      title: "500+ Weddings",
      description: "Years of experience creating magical moments",
    },
    {
      icon: Sparkles,
      title: "Luxury Experience",
      description: "Premium amenities and sophisticated ambiance",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 px-4 bg-white relative overflow-hidden"
      data-testid="about-section"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-cream-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-green mb-4"
            data-testid="about-title"
          >
            Why Choose Atrium Events?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" data-testid="about-description">
            We transform your wedding vision into reality with elegance,
            sophistication, and unmatched attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white to-cream-50 border-2 border-transparent hover:border-navy-green shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
                data-testid={`feature-card-${index}`}
              >
                <div className="mb-4 inline-block p-4 bg-navy-green/10 rounded-full group-hover:bg-navy-green group-hover:scale-110 transition-all duration-500">
                  <Icon className="w-8 h-8 text-navy-green group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-navy-green mb-2" data-testid={`feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600" data-testid={`feature-description-${index}`}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;