import React from 'react';
import { Link } from 'react-router-dom';
import { useOrganizerDashboard } from '@/hooks/useDashboard';
import DashboardStats from '@/components/organizer/DashboardStats';
import RecentEventsTable from '@/components/organizer/RecentEventsTable';

const OrganizerDashboard = () => {

  const { data, isLoading, isError, error } = useOrganizerDashboard();

  const dashboardPayload = data?.data || data;

  if (isError) {
    return (
      <div className="p-6 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200">
        Failed to load dashboard: {error?.message || 'Something went wrong.'}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Organizer Dashboard</h1>
          <p className="text-zinc-500 text-sm">Overview of your event listings and recent updates.</p>
        </div>
        <Link
          to="/organizer/events/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          + Create Event
        </Link>
      </div>

      <DashboardStats summary={dashboardPayload?.summary} isLoading={isLoading} />
      <RecentEventsTable events={dashboardPayload?.recent_events} isLoading={isLoading} />
    </div>
  );
};

export default OrganizerDashboard;