import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, XCircle, Trash2, Calendar, Clock, User, Mail, Phone, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API}/bookings`);
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`${API}/bookings/${id}`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      toast.error("Failed to update booking");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      await axios.delete(`${API}/bookings/${id}`);
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-navy-green" data-testid="loading-message">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-navy-green mb-2" data-testid="admin-title">Admin Dashboard</h1>
            <p className="text-gray-600">Manage all wedding bookings</p>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-navy-green text-navy-green hover:bg-navy-green hover:text-white transition-all"
            data-testid="back-home-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="grid gap-6" data-testid="bookings-container">
          {bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500 text-lg" data-testid="no-bookings-message">No bookings yet</p>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} className="p-6 hover:shadow-xl transition-all duration-300 border-2" data-testid={`booking-card-${booking.id}`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl font-bold text-navy-green" data-testid={`booking-name-${booking.id}`}>{booking.customer_name}</h3>
                      <Badge className={`${getStatusColor(booking.status)} border`} data-testid={`booking-status-${booking.id}`}>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-navy-green" />
                        <span data-testid={`booking-email-${booking.id}`}>{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-navy-green" />
                        <span data-testid={`booking-phone-${booking.id}`}>{booking.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-navy-green" />
                        <span data-testid={`booking-date-${booking.id}`}>{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-navy-green" />
                        <span className="capitalize" data-testid={`booking-timeslot-${booking.id}`}>{booking.time_slot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-navy-green" />
                        <span data-testid={`booking-eventtype-${booking.id}`}>{booking.event_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-navy-green" />
                        <span data-testid={`booking-guests-${booking.id}`}>{booking.guest_count} guests</span>
                      </div>
                    </div>
                    
                    {booking.special_requests && (
                      <div className="mt-2 p-3 bg-cream-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Special Requests:</strong> {booking.special_requests}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    {booking.status === "pending" && (
                      <Button
                        onClick={() => updateBookingStatus(booking.id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        data-testid={`confirm-btn-${booking.id}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </Button>
                    )}
                    {booking.status !== "cancelled" && (
                      <Button
                        onClick={() => updateBookingStatus(booking.id, "cancelled")}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-2"
                        data-testid={`cancel-btn-${booking.id}`}
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteBooking(booking.id)}
                      variant="destructive"
                      className="flex items-center gap-2"
                      data-testid={`delete-btn-${booking.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;