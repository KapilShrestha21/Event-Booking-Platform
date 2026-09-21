import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvent';
import { useDebounce } from 'use-debounce';

const AllPublicEvent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 300);

    const { data, isLoading, isError, error } = useEvents(debouncedSearch);

    const events = data?.data || data || [];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Explore Events</h1>
                    <p className="text-zinc-500 text-sm">Discover and book tickets for upcoming experiences.</p>
                </div>
            </div>

            {/* Search Box - KEPT PERMANENTLY MOUNTED */}
            <div className="max-w-xl mx-auto pt-3">
                <div className="relative flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        aria-label="Search events"
                        placeholder="Search by event title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-none px-3 text-sm font-medium"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* CONDITIONAL SECTION: ONLY TOGGLES THE GRID BELOW */}
            {isLoading ? (
                <div className="animate-pulse space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-64 bg-zinc-100 rounded-2xl"></div>
                        <div className="h-64 bg-zinc-100 rounded-2xl"></div>
                        <div className="h-64 bg-zinc-100 rounded-2xl"></div>
                    </div>
                </div>
            ) : isError ? (
                <div className="text-center space-y-4 font-sans py-8">
                    <p className="text-rose-600 font-medium">Failed to load events: {error?.message || 'Unknown error'}</p>
                    <Link to="/" className="text-sm text-emerald-600 hover:underline">← Back to Home</Link>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                    <p className="text-zinc-500 text-sm">No events are currently available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                    {events.map((event) => {
                        const eventId = event.id || event._id;

                        return (
                            <div
                                key={eventId}
                                className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl"
                            >
                                <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">

                                    {/* Category + Price */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[9px] sm:text-xs uppercase tracking-wider font-semibold px-2 sm:px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 truncate">
                                            {event.category || 'General'}
                                        </span>

                                        <span className="text-xs sm:text-sm font-bold text-emerald-600 whitespace-nowrap">
                                            ${Number(event.price || 0).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Event Image + Details */}
                                    <div className="space-y-2 sm:space-y-3">

                                        {/* Event Image */}
                                        <div className="w-full h-32 sm:h-48 md:h-52 overflow-hidden rounded-lg sm:rounded-xl bg-zinc-100">
                                            {event.image_url ? (
                                                <img
                                                    src={event.image_url}
                                                    alt={event.title || 'Event image'}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';

                                                        const fallback =
                                                            e.currentTarget.nextElementSibling;

                                                        if (fallback) {
                                                            fallback.classList.remove('hidden');
                                                        }
                                                    }}
                                                />
                                            ) : null}

                                            {/* Image Fallback */}
                                            <div
                                                className={`w-full h-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-100 ${event.image_url ? 'hidden' : ''
                                                    }`}
                                            >
                                                <span className="text-xl sm:text-3xl mb-1">
                                                    🎟️
                                                </span>

                                                <span className="text-[9px] sm:text-sm">
                                                    No image available
                                                </span>
                                            </div>
                                        </div>

                                        {/* Event Title */}
                                        <h3 className="text-sm sm:text-lg font-bold text-zinc-900 line-clamp-1">
                                            {event.title}
                                        </h3>

                                        {/* Venue */}
                                        <p className="text-[10px] sm:text-xs text-zinc-500 line-clamp-1">
                                            📍 {event.venue || event.location}
                                        </p>

                                        {/* Date */}
                                        <p className="text-[10px] sm:text-xs text-zinc-500">
                                            📅{' '}
                                            {event.event_date
                                                ? new Date(event.event_date).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    }
                                                )
                                                : 'Date not available'}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[10px] sm:text-xs text-zinc-600 line-clamp-2">
                                        {event.description || 'No description available.'}
                                    </p>

                                </div>

                                <div className="p-6 pt-0">
                                    <Link
                                        to={`/events/${eventId}`}
                                        className="block w-full text-center bg-zinc-100 hover:bg-emerald-600 hover:text-white text-zinc-800 text-sm font-medium py-2.5 rounded-xl transition-colors"
                                    >
                                        View Details & Book
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllPublicEvent;