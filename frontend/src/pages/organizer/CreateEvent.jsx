import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EventForm from '@/components/EventForm';
import { createEventSchema } from '@/schemas/event.schema';
import { useCreateEvent } from '@/hooks/useEvent';
import { toast } from "sonner";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { mutate: createEvent, isPending } = useCreateEvent();

  const handleCreate = async (formData) => {
    createEvent(formData, {
      onSuccess: () => {
        toast.success("Event published!", {
          description: "Your new event is now live and ready for tickets.",
        });
        navigate('/organizer/my-events');
      },
      onError: (error) => {
        toast.error("Failed to create event", {
          description: error.response?.data?.message || error.message || "An error occurred while publishing.",
        });
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header & Navigation */}
      <div className="space-y-2">
        <Link
          to="/organizer/my-events"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Events
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Create New Event
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to set up and publish your event page.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Container Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
          <EventForm
            schema={createEventSchema}
            onSubmit={handleCreate}
            isLoading={isPending}
            title=""
            submitLabel="Publish Event"
          />
        </div>

        {/* Sidebar Guidelines */}
        <div className="space-y-6 lg:sticky lg:top-6">
          {/* Tips Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Tips
            </h3>
            <ul className="space-y-3.5 text-xs text-gray-600 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                <span><strong>High-Resolution Banner:</strong> Use a high-quality 16:9 image to attract ticket buyers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                <span><strong>Clear Description:</strong> Outline schedule, speakers, age restrictions, or special perks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                <span><strong>Double Check Dates:</strong> Confirm start times and ticket limits before hitting publish.</span>
              </li>
            </ul>
          </div>

          {/* Assistance Callout */}
          <div className="bg-indigo-50/70 rounded-2xl border border-indigo-100 p-5 space-y-2">
            <h4 className="text-sm font-semibold text-indigo-950">Need Assistance?</h4>
            <p className="text-xs text-indigo-800/90 leading-relaxed">
              Make sure to save your draft configurations if you are missing venue or pricing details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;