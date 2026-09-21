import { useCreateBooking } from '@/hooks/useBooking';
import { useEventById } from '@/hooks/useEvent';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";

const BookingPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [quantity, setQuantity] = useState(1);

    // Attendee form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const { data, isLoading, isError, error } = useEventById(eventId);
    const { mutate: createBooking, isPending } = useCreateBooking();

    const event = data?.data || data || {};

    // Determine available tickets from event data (fallback to 10 if property is missing)
    const availableTickets = event.available_tickets ?? event.capacity ?? 10;

    // Auto-populate form when user data loads from auth context
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || user.full_name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    // Ensure quantity resets or caps if available tickets change
    useEffect(() => {
        if (availableTickets > 0 && quantity > availableTickets) {
            setQuantity(availableTickets);
        }
    }, [availableTickets, quantity]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const subtotal = (event.price || 0) * quantity;

    const handleBookingSubmit = (e) => {
        e.preventDefault();

        const bookingPayload = {
            event_id: Number(eventId),
            quantity: Number(quantity),
            total_price: subtotal,
            ...formData,
        };

        createBooking(bookingPayload, {
            onSuccess: () => {
                toast.success("Booking confirmed!", {
                    description: "Your tickets have been successfully purchased.",
                });
                navigate('/customer/my-bookings');
            },
            onError: (error) => {
                toast.error("Booking failed", {
                    description: error.response?.data?.message || error.message || "An error occurred while processing your booking.",
                });
            },
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto animate-pulse space-y-6">
                <div className="h-8 bg-zinc-200 rounded w-1/4"></div>
                <div className="h-64 bg-zinc-100 rounded-2xl"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 max-w-7xl mx-auto text-center space-y-4">
                <p className="text-rose-600 font-medium">Failed to load event details: {error?.message || 'Unknown error'}</p>
                <Link to="/events" className="text-sm text-emerald-600 hover:underline">Back to Events</Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            {/* Top Navigation / Back */}
            <div>
                <Link to={`/`} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                    ← Back to Event Details
                </Link>
                <h1 className="text-2xl font-bold text-zinc-900 mt-2">Complete Your Booking</h1>
                <p className="text-zinc-500 text-sm">Review event details and confirm your attendee information.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Form Column */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleBookingSubmit} className="space-y-6">

                        {/* Ticket Quantity Card */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-zinc-900">Select Tickets</h2>
                                <span className="text-xs text-zinc-500 font-medium">
                                    {availableTickets} tickets remaining
                                </span>
                            </div>

                            {/* Low Stock Warning Banner */}
                            {availableTickets > 0 && availableTickets <= 5 && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center gap-2">
                                    <span>⚠️ Only {availableTickets} tickets left! Book soon.</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                <div>
                                    <p className="font-medium text-zinc-900">General Admission</p>
                                    <p className="text-sm text-zinc-500">${Number(event.price || 0).toFixed(2)} per ticket</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1 || availableTickets === 0}
                                        className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-bold transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        -
                                    </button>
                                    <span className="w-6 text-center font-semibold text-zinc-900">{availableTickets === 0 ? 0 : quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}
                                        disabled={quantity >= availableTickets || availableTickets === 0}
                                        className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-bold transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Attendee Info Card */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-zinc-900">Attendee Information</h2>
                                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
                                    Pre-filled from account
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sold Out State vs Submit Button */}
                        {availableTickets === 0 ? (
                            <div className="w-full bg-zinc-100 border border-zinc-200 text-zinc-500 font-semibold text-center py-3.5 rounded-xl">
                                This Event is Sold Out
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-3 rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isPending ? 'Processing Booking...' : 'Confirm & Book Tickets'}
                            </button>
                        )}

                    </form>
                </div>

                {/* Right Summary Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xl space-y-4 sticky top-6">
                        <h3 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-3">Order Summary</h3>

                        <div className="space-y-2">
                            <h4 className="font-bold text-zinc-900">{event.title || 'Loading Event...'}</h4>
                            <p className="text-xs text-zinc-500">{event.venue || event.location}</p>
                            <p className="text-xs text-zinc-500">
                                {event.event_date ? new Date(event.event_date).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                }) : ''}
                            </p>
                        </div>

                        <div className="border-t border-zinc-100 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-zinc-600">
                                <span>{quantity}x Ticket(s)</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                                <span>Booking Fee</span>
                                <span>$0.00</span>
                            </div>
                        </div>

                        <div className="border-t border-zinc-100 pt-4 flex justify-between items-center font-bold text-zinc-900">
                            <span>Total Amount</span>
                            <span className="text-lg text-emerald-600">${subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BookingPage;