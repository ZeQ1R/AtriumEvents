import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Booking = () => {
  console.log("Backend URL:", BACKEND_URL);
  console.log("API endpoint:", API);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [availability, setAvailability] = useState({
      morning_available: true,
      afternoon_available: true,
      evening_available: true
    });
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    event_type: "",
    guest_count: "",
    special_requests: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate]);

  const checkAvailability = async () => {
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      console.log("Checking availability for date:", dateStr);
      console.log("API URL:", `${API}/availability`);
      
      const response = await axios.post(`${API}/availability`, {
        booking_date: dateStr,
      });
      
      console.log("Availability response:", response.data);
      setAvailability(response.data);
      setSelectedTimeSlot(""); // Reset time slot when date changes
    } catch (error) {
      console.error("Availability check error:", error);
      toast.error("Failed to check availability. Please make sure the backend server is running.");
      // Set default availability if backend fails
      setAvailability({
        morning_available: true,
        afternoon_available: true,
        evening_available: true
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (!selectedTimeSlot) {
      toast.error("Please select a time slot");
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        time_slot: selectedTimeSlot,
        guest_count: parseInt(formData.guest_count),
      };

      await axios.post(`${API}/bookings`, bookingData);
      toast.success("Booking submitted successfully! We'll contact you soon.");

      // Reset form
      setFormData({
        customer_name: "",
        email: "",
        phone: "",
        event_type: "",
        guest_count: "",
        special_requests: "",
      });
      setSelectedDate(null);
      setSelectedTimeSlot("");
      setAvailability(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    { value: "morning", label: "Morning (9:00 AM - 12:00 PM)", available: availability?.morning_available },
    { value: "afternoon", label: "Afternoon (1:00 PM - 5:00 PM)", available: availability?.afternoon_available },
    { value: "evening", label: "Evening (6:00 PM - 11:00 PM)", available: availability?.evening_available },
  ];

  return (
    <section
      id="booking"
      className="py-20 px-4 bg-gradient-to-br from-green-50 via-cream-50 to-white relative overflow-hidden"
      data-testid="booking-section"
    >
      <div className="absolute top-20 left-10 w-96 h-96 bg-navy-green/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-green mb-4"
            data-testid="booking-title"
          >
            Book Your Special Day
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" data-testid="booking-description">
            Select your preferred date and time, and we'll make your dream
            wedding a reality.
          </p>
        </div>

        <Card className="p-8 md:p-12 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Calendar Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-navy-green" />
                <Label className="text-xl font-semibold text-navy-green">
                  Select Date
                </Label>
              </div>
              <div className="flex justify-center" data-testid="calendar-container">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-2xl border-2 border-navy-green/20 p-4 bg-white shadow-lg"
                />
              </div>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && availability && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-navy-green" />
                  <Label className="text-xl font-semibold text-navy-green">
                    Select Time Slot
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="timeslot-container">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => slot.available && setSelectedTimeSlot(slot.value)}
                      disabled={!slot.available}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedTimeSlot === slot.value
                          ? "border-navy-green bg-navy-green text-white shadow-lg scale-105"
                          : slot.available
                          ? "border-gray-300 hover:border-navy-green hover:shadow-md"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      data-testid={`timeslot-${slot.value}`}
                    >
                      <div className="font-semibold">{slot.value.charAt(0).toUpperCase() + slot.value.slice(1)}</div>
                      <div className="text-sm mt-1">{slot.label.split(' ').slice(1).join(' ')}</div>
                      {!slot.available && (
                        <div className="text-xs mt-2 font-semibold">Booked</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {selectedDate && selectedTimeSlot && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-t-2 border-gray-200 pt-8">
                  <h3 className="text-2xl font-bold text-navy-green mb-6">
                    Your Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">Full Name *</Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        required
                        placeholder="John & Jane Doe"
                        className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                        data-testid="input-name"
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
                        placeholder="johndoe@example.com"
                        className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+1 (555) 123-4567"
                        className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                        data-testid="input-phone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event_type">Event Type *</Label>
                      <Input
                        id="event_type"
                        name="event_type"
                        value={formData.event_type}
                        onChange={handleInputChange}
                        required
                        placeholder="Wedding Ceremony"
                        className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                        data-testid="input-eventtype"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guest_count">Guest Count *</Label>
                      <Input
                        id="guest_count"
                        name="guest_count"
                        type="number"
                        value={formData.guest_count}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder="150"
                        className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                        data-testid="input-guestcount"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="special_requests">Special Requests</Label>
                    <Textarea
                      id="special_requests"
                      name="special_requests"
                      value={formData.special_requests}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or requests..."
                      rows={4}
                      className="border-2 border-gray-300 focus:border-navy-green rounded-lg"
                      data-testid="input-specialrequests"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-navy-green hover:bg-navy-green/90 text-white py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  data-testid="submit-booking-btn"
                >
                  {loading ? "Submitting..." : "Confirm Booking"}
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </section>
  );
};

export default Booking;