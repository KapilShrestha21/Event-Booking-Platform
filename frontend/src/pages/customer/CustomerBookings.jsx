import { useMyBookings } from '@/hooks/useBooking';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CustomerBookings = () => {
    const { data, isLoading, isError, error } = useMyBookings();
    const bookings = data?.data || data || [];

    // State to track which ticket is currently open in the modal
    const [selectedBooking, setSelectedBooking] = useState(null);

    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto animate-pulse space-y-6">
                <div className="h-8 bg-zinc-200 rounded w-1/4"></div>
                <div className="h-40 bg-zinc-100 rounded-2xl"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 max-w-7xl mx-auto text-center space-y-4">
                <p className="text-rose-600 font-medium">Failed to load booking details: {error?.message || 'Unknown error'}</p>
                <Link to="/events" className="text-sm text-emerald-600 hover:underline">Back to Events</Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">My Bookings</h1>
                    <p className="text-zinc-500 text-sm">Manage your ticket reservations and upcoming events.</p>
                </div>
                <Link
                    to="/events"
                    className="self-start md:self-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                >
                    Browse More Events
                </Link>
            </div>

            {/* Bookings List */}
            {bookings.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                    <p className="text-zinc-500 text-sm">You haven't booked any tickets yet.</p>
                    <Link to="/events" className="text-emerald-600 font-medium text-sm hover:underline">
                        Explore available events →
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            {/* Left: Event Info */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                                        {booking.status}
                                    </span>
                                    <span className="text-xs text-zinc-400">
                                        Booked on {new Date(booking.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900">{booking.event_title}</h3>
                                <p className="text-xs text-zinc-500">{booking.venue}</p>
                                <p className="text-xs font-medium text-zinc-700">
                                    📅 Date: {new Date(booking.event_date).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>

                            {/* Right: Financials & Actions */}
                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100">
                                <div className="text-left md:text-right">
                                    <p className="text-xs text-zinc-500">{booking.quantity}x Ticket(s)</p>
                                    <p className="text-base font-bold text-emerald-600">${Number(booking.total_price).toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(booking)}
                                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                                >
                                    View Ticket
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- PROFESSIONAL TICKET MODAL --- */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden space-y-6">
                        
                        {/* Modal Header */}
                        <div className="bg-emerald-600 p-6 text-white space-y-1 relative">
                            <span className="text-xs uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-md font-semibold">
                                Official Pass
                            </span>
                            <h2 className="text-xl font-bold">{selectedBooking.event_title}</h2>
                            <p className="text-xs text-emerald-100">{selectedBooking.venue}</p>
                        </div>

                        {/* Modal Content / Ticket Details */}
                        <div className="px-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                <div>
                                    <p className="text-xs text-zinc-400 font-medium">Attendee</p>
                                    <p className="font-semibold text-zinc-900">{selectedBooking.name || 'Guest User'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 font-medium">Quantity</p>
                                    <p className="font-semibold text-zinc-900">{selectedBooking.quantity} Ticket(s)</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 font-medium">Event Date</p>
                                    <p className="font-semibold text-zinc-900">
                                        {new Date(selectedBooking.event_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 font-medium">Booking ID</p>
                                    <p className="font-semibold text-zinc-900">#{selectedBooking.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer / Actions */}
                        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex gap-3">
                            <button
                                onClick={() => alert("Downloading ticket PDF...")}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                            >
                                Download Ticket
                            </button>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium text-sm rounded-xl transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerBookings;