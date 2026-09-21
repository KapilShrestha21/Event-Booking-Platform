import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout & Protection

import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
// Root Pages (src/pages/)
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Account from '@/pages/account/Account';

// Customer Pages (src/pages/customer/)
import BookingPage from '@/pages/customer/BookingPage';
import CustomerBookings from '@/pages/customer/CustomerBookings';
import CustomerDashboard from '@/pages/customer/CustomerDashboard';

// Public Pages
import PublicEventDetail from '@/pages/PublicEventDetail';
import AllPublicEvent from '@/pages/AllPublicEvent';

// Organizer Pages (src/pages/organizer/)
import OrganizerDashboard from '@/pages/organizer/OrganizerDashboard';
import MyEvents from '@/pages/organizer/MyEvents';
import CreateEvent from '@/pages/organizer/CreateEvent';
import EventDetails from '@/pages/organizer/EventDetails';
import UpdateEvent from '@/pages/organizer/UpdateEvent';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Full-Screen Auth Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* 2. Main Site Routes (Navbar + Footer Layout) */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events/:eventId" element={<PublicEventDetail />} />
        <Route path="/events" element={<AllPublicEvent />} />

        {/* Protected Customer Routes (Accessible to authenticated customers) */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/customer/events/:eventId/book" element={<BookingPage />} />
          <Route path="/customer/my-bookings" element={<CustomerBookings />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/account" element={<Account />} />
        </Route>
      </Route>

      {/* Protected Organizer Routes (Only accessible to users with role 'organizer') */}
      <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/my-events" element={<MyEvents />} />
          <Route path="/organizer/events/new" element={<CreateEvent />} />
          <Route path="/organizer/events/:id" element={<EventDetails />} />
          <Route path="/organizer/events/:id/edit" element={<UpdateEvent />} />
          <Route path="/organizer/account" element={<Account />} />
        </Route>
      </Route>


      {/* Fallback 404 Route */}
      <Route path="*" element={<div className="p-12 text-center font-medium text-gray-600">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;