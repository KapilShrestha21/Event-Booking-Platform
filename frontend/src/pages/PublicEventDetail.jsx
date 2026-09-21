import { useAuth } from '@/hooks/useAuth';
import { useEventById } from '@/hooks/useEvent';
import React from 'react'
import { Link, useParams } from 'react-router-dom'

const PublicEventDetail = () => {
    const { eventId } = useParams();
    const { data, isLoading, isError, error } = useEventById(eventId);

    const event = data?.data || data || [];
    const { isOrganizer } = useAuth();

    if (isLoading) {
        return (
            <div className="p-6 max-w-5xl mx-auto animate-pulse space-y-6">
                <div className="h-8 bg-zinc-200 rounded w-1/3"></div>
                <div className="h-96 bg-zinc-100 rounded-2xl"></div>
                <div className="space-y-4">
                    <div className="h-6 bg-zinc-200 rounded w-1/2"></div>
                    <div className="h-24 bg-zinc-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 max-w-5xl mx-auto text-center space-y-4 font-sans">
                <p className="text-rose-600 font-medium">Failed to load event details: {error?.message || 'Event not found'}</p>
                <Link to="/events" className="text-sm text-emerald-600 hover:underline">← Back to Events</Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans">
            {/* Top Navigation / Back */}
            <div>
                <Link to="/events" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                    ← Back to All Events
                </Link>
            </div>

            {/* Event Header Card */}
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl space-y-6">
                <div className="space-y-3">
                    <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                        {event.category || 'General Event'}
                    </span>
                    <h1 className="text-3xl font-extrabold text-zinc-900">{event.title}</h1>
                    <p className="text-zinc-500 text-sm flex items-center gap-2">
                        <span>📍 {event.venue || event.location}</span>
                        <span>•</span>
                        <span>📅 {event.event_date ? new Date(event.event_date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }) : ''}</span>
                    </p>
                </div>

                {/* Banner Image Placeholder (if you have event.image_url) */}
                <div className="w-full h-72 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-400 overflow-hidden">
                    {event.image_url ? (
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <span>[ Event Banner Image ]</span>
                    )}
                </div>

                {/* Grid Layout for Description and Pricing Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Left: Description */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-zinc-900">About This Event</h2>
                        <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
                            {event.description || 'No description provided for this event.'}
                        </p>
                    </div>

                    {/* Right: Booking Box Card */}
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-6 h-fit">
                        <div>
                            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Ticket Price</p>
                            <p className="text-3xl font-bold text-zinc-900 mt-1">
                                ${Number(event.price || 0).toFixed(2)}
                            </p>
                        </div>

                        <div className="space-y-2 text-xs text-zinc-500 border-t border-zinc-200 pt-4">
                            <div className="flex justify-between">
                                <span>Available Capacity:</span>
                                <span className="font-semibold text-zinc-800">{event.available_tickets ?? event.capacity ?? 'Limited'} spots</span>
                            </div>
                        </div>

                        {isOrganizer ? (
                            <span className="text-xs text-zinc-400 font-medium italic">
                                Organizer cannot book tickets
                            </span>
                        ) : (

                            <Link
                                to={`/customer/events/${eventId}/book`}
                                className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-3 rounded-xl shadow-sm transition-colors"
                            >
                                Book Tickets Now
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicEventDetail;