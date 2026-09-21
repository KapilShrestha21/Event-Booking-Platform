import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import EventForm from '@/components/EventForm';
import { updateEventSchema } from '@/schemas/event.schema';
import { useEventById, useUpdateEvent } from '@/hooks/useEvent';
import { toast } from "sonner";

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: isFetching, isError } = useEventById(id);
  const event = data?.data || data;

  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

  const handleUpdate = (formData) => {
    updateEvent(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Event updated successfully!");
          navigate("/organizer/my-events");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update event"
          );
        },
      }
    );
  };

  // Loading State with Skeleton UI
  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-96" />
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
          <div className="h-28 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded w-32 ml-auto" />
        </div>
      </div>
    );
  }

  // Error State with Action Card
  if (isError || !event) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl border border-rose-200 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Event Not Found</h3>
        <p className="text-sm text-gray-500">
          The event you are trying to edit does not exist or may have been removed.
        </p>
        <Link
          to="/organizer/my-events"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
        >
          Back to My Events
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col gap-2">
        <Link
          to="/organizer/my-events"
          className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors w-fit group"
        >
          <svg
            className="w-4 h-4 mr-1 transform group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Events
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Event Details</h1>
          <p className="text-sm text-gray-500">
            Update your listing details, schedules, pricing, and ticket capacity.
          </p>
        </div>
      </div>

      {/* Form Container Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
        <EventForm
          schema={updateEventSchema}
          initialValues={event}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
          title=""
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default UpdateEvent;