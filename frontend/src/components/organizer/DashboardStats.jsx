import React from 'react';

const DashboardStats = ({ summary, isLoading }) => {
  const statItems = [
    {
      title: "Total Events",
      value: summary?.total_events ?? 0,
      label: "All time created",
    },
    {
      title: "Active Events",
      value: summary?.active_events ?? 0,
      label: "Currently published",
    },
    {
      title: "Draft Events",
      value: summary?.draft_events ?? 0,
      label: "Unpublished drafts",
    },
    {
      title: "Total Tickets Created",
      value: summary?.total_tickets_created ?? 0,
      label: "Total ticket capacity",
    },
  ];

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 bg-white border border-zinc-200 rounded-2xl animate-pulse space-y-3 shadow-xl">
            <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
            <div className="h-8 bg-zinc-200 rounded w-1/3"></div>
            <div className="h-3 bg-zinc-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Active Dashboard Stats Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div 
          key={item.title} 
          className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
        >
          <h3 className="text-sm font-medium text-zinc-500">{item.title}</h3>
          <p className="text-3xl font-bold text-zinc-900 mt-2">
            {item.value.toLocaleString()}
          </p>
          <span className="text-xs text-zinc-400 mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;