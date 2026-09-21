import { useAuth } from '@/hooks/useAuth';
import { useMyBookings } from '@/hooks/useBooking';
import { useCustomerDashboard } from '@/hooks/useDashboard';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedBooking, setSelectedBooking] = useState(null); // Modal state
    const { user } = useAuth();
    const { data } = useMyBookings();
    const { data: dashboardData, isLoading: dashboardLoading, isError: dashboardError,  error} = useCustomerDashboard();

    const allBookings = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    // Helper to safely resolve nested or flat backend property names
    const getBookingDetails = (booking) => {
        const id = booking.id || booking._id;

        // Checks all common API property names for event title
        const title =
            booking.event?.title ||
            booking.event?.name ||
            booking.event_title ||
            booking.eventTitle ||
            booking.event_name ||
            booking.title ||
            'Untitled Event';

        // Event date fallbacks
        const date =
            booking.event?.event_date ||
            booking.event?.date ||
            booking.event_date ||
            booking.date ||
            'TBA';

        // Venue fallbacks
        const venue =
            booking.event?.venue ||
            booking.event?.location ||
            booking.venue ||
            booking.location ||
            'Online / TBA';

        // Image URL fallbacks
        const image =
            booking.event?.image_url ||
            booking.event?.image ||
            booking.image_url ||
            booking.image ||
            '';

        const ticketsCount = booking.tickets_count || booking.ticketsCount || booking.quantity || 1;
        const totalPaid = booking.total_price || booking.totalPaid || booking.amount || 0;
        const status = booking.status || 'Confirmed';

        return { id, title, date, venue, image, ticketsCount, totalPaid, status };
    };

    // Separate bookings into upcoming and past based on event date
    const currentDate = new Date();
    const upcomingBookings = allBookings.filter((booking) => {
        const { date } = getBookingDetails(booking);
        const eventDate = new Date(date);
        return isNaN(eventDate.getTime()) || eventDate >= currentDate;
    });

    const pastBookings = allBookings.filter((booking) => {
        const { date } = getBookingDetails(booking);
        const eventDate = new Date(date);
        return !isNaN(eventDate.getTime()) && eventDate < currentDate;
    });

    const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            Welcome back, {user?.name || 'Customer'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">Manage your event registrations and view tickets.</p>
                    </div>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                        Browse More Events
                    </Link>
                </div>

                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Events</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">{upcomingBookings.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Attended</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">{pastBookings.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Wishlist</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">0</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-200 gap-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                            activeTab === 'upcoming'
                                ? 'border-emerald-600 text-emerald-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Upcoming Bookings ({upcomingBookings.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('past')}
                        className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                            activeTab === 'past'
                                ? 'border-emerald-600 text-emerald-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Past Events ({pastBookings.length})
                    </button>
                </div>

                {/* Tab Content Area */}
                <div className="space-y-4">
                    {displayedBookings.map((booking) => {
                        const { id, title, date, venue, image, ticketsCount, totalPaid, status } = getBookingDetails(booking);

                        return (
                            <div
                                key={id}
                                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={title}
                                            className="w-20 h-20 rounded-xl object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold shrink-0">
                                            No Image
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                                            {status}
                                        </span>
                                        <h3 className="text-base font-bold text-slate-900">{title}</h3>
                                        <p className="text-xs text-slate-500">📅 {date} • 📍 {venue}</p>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                                    <span className="text-xs font-bold text-slate-700">
                                        {ticketsCount} {ticketsCount === 1 ? 'Ticket' : 'Tickets'} (${Number(totalPaid).toFixed(2)})
                                    </span>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBooking(booking)}
                                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                                    >
                                        View Ticket
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {displayedBookings.length === 0 && (
                        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200/80">
                            <p className="text-sm text-slate-500">No events found in this category.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Ticket Details Popup Modal */}
            {selectedBooking && (() => {
                const modalDetails = getBookingDetails(selectedBooking);
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                            
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                                <h2 className="text-sm font-bold text-slate-800">Ticket Details</h2>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="text-slate-400 hover:text-slate-600 font-bold text-lg leading-none cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Ticket Details */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                                        {modalDetails.status}
                                    </span>
                                    <h3 className="text-lg font-black text-slate-900 mt-2">
                                        {modalDetails.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Booking ID: <span className="font-mono">{modalDetails.id}</span>
                                    </p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-700">
                                    <p><strong>📅 Date:</strong> {modalDetails.date}</p>
                                    <p><strong>📍 Venue:</strong> {modalDetails.venue}</p>
                                    <p><strong>👤 Name:</strong> {user?.name || 'Customer'}</p>
                                    <p><strong>🎟️ Quantity:</strong> {modalDetails.ticketsCount} Ticket(s)</p>
                                    <p><strong>💳 Total Paid:</strong> ${Number(modalDetails.totalPaid).toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all"
                                >
                                    Print Ticket
                                </button>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                );
            })()}

        </div>
    );
};

export default CustomerDashboard;