import { useDeleteEvent, useEventById, useUpdateEvent } from '@/hooks/useEvent';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
} from '@/components/ui/alert-dialog';

const EventDetails = () => {
  const navigate = useNavigate();

  // get user id from url with the help of react router dom
  const { id } = useParams();

  // fetch the event from selected id
  const { data, isLoading, isError, error } = useEventById(id);

  // handle nested data strucutre coming from backend
  const event = data?.data || data || null;

  // for deleting event
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  // for updating event
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // for deleting event
  const handleDelete = (id) => {
    deleteEvent(id, {
      onSuccess: () => {
        navigate('/organizer/my-events');
      },
    });
  };

  // when the user changes the event status, send only the status field to the backend instead of sending the entire event form
  const handleStatusChange = (newStatus) => {
    // Only send the field that changed (cleaner & safer)
    updateEvent({
      id,
      data: { status: newStatus },
    });
    console.log('status', newStatus);
  };

  // early return
  if (isLoading) {
    // return skeleton UI
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded-xl md:col-span-2"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !event || Array.isArray(event)) {
    // return error message + back link
    return (
      <div className="p-6 max-w-6xl mx-auto text-center py-16 space-y-3">
        <p className="text-rose-600 font-semibold text-lg">Failed to load event details.</p>
        <p className="text-gray-500 text-sm">
          {error?.message || 'The requested event could not be found.'}
        </p>
        <Link
          to="/organizer/my-events"
          className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Back to My Events
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Back link */}
      <div>
        <Link
          to="/organizer/my-events"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 font-medium"
        >
          ← Back to My Events
        </Link>
      </div>

      {/* Header: title + status badge + Edit/Delete buttons */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusBadge(
                event.status
              )}`}
            >
              {event.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Created on {new Date(event.created_at || Date.now()).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Edit button */}
          <button
            onClick={() => navigate(`/organizer/events/${id}/edit`)}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Edit Event
          </button>

          {/* Delete button with Alert Dialog */}
          <AlertDialog>
            <AlertDialogTrigger
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the event{' '}
                  <strong className="text-gray-900">"{event.title}"</strong> and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-600"
                >
                  Delete Event
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Metrics cards: Price, Capacity, Potential Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Ticket Price</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${Number(event.price || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Capacity</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {event.total_tickets?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Est. Potential Revenue</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            ${(Number(event.price || 0) * Number(event.total_tickets || 0)).toLocaleString(
              undefined,
              { minimumFractionDigits: 2 }
            )}
          </p>
        </div>
      </div>

      {/* Detailed Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
              {event.description || 'No description provided for this event.'}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Date & Time</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {event.event_date
                  ? new Date(event.event_date).toLocaleString(undefined, {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Venue / Location</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {event.venue || 'TBD'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Status Control Sidebar */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">Publishing Control</h2>
          <p className="text-xs text-gray-500">
            Quickly update the visibility state of this event.
          </p>

          <div className="space-y-2 pt-2">
            {event.status !== 'published' && (
              <button
                onClick={() => handleStatusChange('published')}
                disabled={isUpdating}
                className="w-full py-2 px-3 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Publish Event'}
              </button>
            )}

            {event.status !== 'draft' && (
              <button
                onClick={() => handleStatusChange('draft')}
                disabled={isUpdating}
                className="w-full py-2 px-3 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Unpublish to Draft'}
              </button>
            )}

            {event.status !== 'cancelled' && (
              <button
                onClick={() => handleStatusChange('cancelled')}
                disabled={isUpdating}
                className="w-full py-2 px-3 text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Cancel Event'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;