import React from 'react'
import { useDeleteEvent, useMyEvents } from '@/hooks/useEvent';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const MyEvents = () => {

  const navigate = useNavigate();

  // it is for reading data
  const { data, isLoading, isError, error } = useMyEvents();

  // it is for writing data
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  // it is for client side searching event 
  const [searchTerm, setSearchTerm] = useState('');

  // it is for filtering the event 
  const [activeTab, setActiveTab] = useState('all');

  // handle nested data strucutre coming from backend
  const events = data?.data || data || [];

  // filter events by tab and search keyword
  // client side data filtering
  // using useMemo to avoid unnecessary re-render of fltering calculation on every render/ on every state change
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {

      // matchesStatus will have true or false
      const matchesStatus =
        activeTab === 'all' || event.status?.toLowerCase() === activeTab;

      // matchesSearch will have true or false
      const matchesSearch =
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchTerm.toLowerCase());

      // it return either true or false
      return matchesStatus && matchesSearch;

    })
  }, [events, searchTerm, activeTab])

  // return the count od the event
  const getTabCount = (status) => {
    if (status === 'all') return events.length;

    return events.filter((e) => e.status?.toLowerCase() === status).length;
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
  }

  const handleDelete = (id, title) => {
    // console.log('Deleting:', id, title);

    deleteEvent(id);
  }

  // for navigation of events
  const tabs = [
    { id: 'all', label: 'All Events' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Draft' },
    { id: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* top header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Events</h1>
          <p className="text-zinc-500 text-sm">
            Manage your event listings, track updates, and edit details.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          to="/organizer/events/new"
        >
          + Create Event
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xl space-y-4">
        <div className="relative">
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event title or venue..."
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-sm bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all"
          />
        </div>

        {/* filter tabs */}
        <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = getTabCount(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-zinc-600 hover:bg-zinc-100 border border-transparent'
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full ${isActive
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-zinc-200 text-zinc-700'
                    }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

      </div>

      {/* main table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
        {isError && (
          <div className="p-4 bg-rose-50 text-rose-700 text-sm border-b border-rose-200">
            Failed to load events: {error?.message || 'Something went wrong.'}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-100">
              <tr>
                <th className="px-5 py-3.5">Event Title</th>
                <th className="px-5 py-3.5">Venue</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Tickets</th>
                <th className="px-5 py-3.5">Avialable ticktes</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {isLoading ? (
                // it is for skeleton cards while loading
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-zinc-200 rounded w-3/4" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-zinc-200 rounded w-1/2" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-zinc-200 rounded w-24" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-zinc-200 rounded w-12" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-zinc-200 rounded w-12" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-zinc-200 rounded w-12" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-zinc-200 rounded w-16" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-zinc-200 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-zinc-500">
                    No events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
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
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                        : 'N/A'}
                    </td>
                    <td className="px-5 py-4 font-medium text-zinc-900">
                      ${Number(event.price).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">{event.total_tickets}</td>
                    <td className="px-5 py-4">{event.available_tickets}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${getStatusBadge(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Navigates to UpdateEvent page */}
                        <button
                          onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
                          className="px-3 py-1 text-xs font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        >
                          Edit
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger
                            disabled={isDeleting}
                            className="px-3 py-1 text-xs font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Delete
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border-zinc-200 text-zinc-900 rounded-2xl shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-zinc-900">Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-500">
                                This action cannot be undone. This will permanently delete "{event.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(event.id, event.title)}
                                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;