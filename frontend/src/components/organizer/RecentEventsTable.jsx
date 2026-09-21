import React from 'react';
import { Link } from 'react-router-dom';

const RecentEventsTable = ({ events = [], isLoading }) => {

    // Log incoming props on every render
    // console.log('RecentEventsTable Render State:', { events, isLoading, typeOfEvents: typeof events, isArray: Array.isArray(events) });

    // Renders a clean visual table of your objects in the DevTools console
    // if (Array.isArray(events) && events.length > 0) {
    //     console.table(events);
    // }

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 animate-pulse space-y-4 shadow-xl">
                <div className="h-5 bg-zinc-200 rounded w-1/4"></div>
                <div className="h-32 bg-zinc-100 rounded-xl"></div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'published':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'draft':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'cancelled':
                return 'bg-rose-100 text-rose-800 border-rose-200';
            default:
                return 'bg-zinc-100 text-zinc-800 border-zinc-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900">Recent Events</h3>
                <Link to="/organizer/my-events" className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
                    View All Events →
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-100">
                        <tr>
                            <th className="px-5 py-3.5">Title</th>
                            <th className="px-5 py-3.5">Venue</th>
                            <th className="px-5 py-3.5">Event Date</th>
                            <th className="px-5 py-3.5">Price</th>
                            <th className="px-5 py-3.5">Tickets</th>
                            <th className="px-5 py-3.5">Avaiable Ticket</th>
                            <th className="px-5 py-3.5">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-5 py-12 text-center text-zinc-500">
                                    No events created yet.
                                </td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.id} className="hover:bg-zinc-50/80 transition-colors">
                                    <td className="px-5 py-4 font-semibold text-zinc-900">
                                        <Link
                                            to={`/organizer/events/${event.id}`}
                                            className="text-emerald-600 hover:text-emerald-800 hover:underline transition-colors underline"
                                        >
                                            {event.title}
                                        </Link>
                                    </td>                                    
                                    <td className="px-5 py-4 text-zinc-600">{event.venue}</td>
                                    <td className="px-5 py-4 text-zinc-600">
                                        {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-5 py-4 font-medium text-zinc-900">
                                        ${Number(event.price).toFixed(2)}
                                    </td>
                                    <td className="px-5 py-4 text-zinc-600">{event.total_tickets}</td>
                                    <td className="px-5 py-4 text-zinc-600">{event.available_tickets}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${getStatusBadge(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentEventsTable;