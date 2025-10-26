import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "123 Wedding Boulevard, Dream City, DC 12345",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
    },
    {
      icon: Mail,
      title: "Email",
      content: "hello@eternalbliss.com",
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Mon - Sat: 9:00 AM - 6:00 PM",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-white relative overflow-hidden"
      data-testid="contact-section"
    >
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cream-100/50 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-green mb-4"
            data-testid="contact-title"
          >
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" data-testid="contact-description">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-navy-green mb-6">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-8">
                Reach out to us through any of the following channels. We're here
                to help make your special day perfect.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-cream-50 transition-colors duration-300"
                    data-testid={`contact-info-${index}`}
                  >
                    <div className="p-3 bg-navy-green/10 rounded-full flex-shrink-0">
                      <Icon className="w-6 h-6 text-navy-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-green mb-1">
                        {info.title}
                      </h4>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-cream-50 border-2 border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                  className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                  data-testid="contact-input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                  className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                  data-testid="contact-input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us about your wedding..."
                  rows={6}
                  className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                  data-testid="contact-input-message"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-navy-green hover:bg-navy-green/90 text-white py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                data-testid="send-message-btn"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;