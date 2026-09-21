
import { useAuth } from '@/hooks/useAuth';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  LuHouse,
  LuLayoutDashboard,
  LuCalendarDays,
  LuPlus,
  LuLogOut,
  LuMenu,
} from 'react-icons/lu';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();
  const { user, logout } = useAuth();

  const userName = user?.name || user?.full_name || 'Organizer';
  const userEmail = user?.email || 'organizer@events.com';

  // Format initials (e.g. "John Doe" -> "JD")
  const initials =
    userName
      ?.trim()
      .split(/\s+/)
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'O';

  // Automatically close mobile sidebar after navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      label: 'Dashboard',
      path: '/organizer/dashboard',
      exact: true,
      icon: <LuLayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'My Events',
      path: '/organizer/my-events',
      icon: <LuCalendarDays className="w-5 h-5" />,
    },
    {
      label: 'Create Event',
      path: '/organizer/events/new',
      icon: <LuPlus className="w-5 h-5" />,
    },
  ];

  const isCollapsed = !isOpen && !isMobileOpen;

  return (
    <div className="flex h-screen bg-white text-zinc-900 overflow-hidden font-sans">

      {/* ================================
          Mobile Backdrop
      ================================= */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ================================
          Sidebar
      ================================= */}
      <aside
        className={`
          fixed md:relative
          z-40
          h-full
          bg-white
          border-r border-zinc-200
          p-3
          flex flex-col justify-between
          select-none
          transition-all duration-300 ease-in-out

          ${
            isMobileOpen
              ? 'translate-x-0 w-64 shadow-2xl'
              : '-translate-x-full md:translate-x-0'
          }

          ${isOpen ? 'md:w-64' : 'md:w-16'}
        `}
      >

        {/* ================================
            Top Section
        ================================= */}
        <div className="space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between px-2 py-1 min-h-[40px]">

            {(isOpen || isMobileOpen) && (
              <span className="text-xl font-bold text-zinc-900 truncate">
                Organizer Portal
              </span>
            )}

            {/* Sidebar Toggle */}
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileOpen(false);
                } else {
                  setIsOpen((prev) => !prev);
                }
              }}
              className="p-2 ml-auto rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <LuMenu className="w-5 h-5" />
            </button>
          </div>

          {/* ================================
              Home
          ================================= */}
          <div>
            <Link
              to="/"
              title="Home page"
              className={`
                flex items-center gap-3
                text-sm font-medium
                text-zinc-600
                hover:bg-emerald-50
                hover:text-emerald-700
                transition-all

                ${
                  isCollapsed
                    ? 'w-10 h-10 mx-auto justify-center rounded-xl'
                    : 'w-full px-3 py-2.5 rounded-xl'
                }
              `}
            >
              <LuHouse className="w-5 h-5 flex-shrink-0" />

              {(isOpen || isMobileOpen) && (
                <span className="truncate">
                  Home
                </span>
              )}
            </Link>
          </div>

          {/* ================================
              Navigation
          ================================= */}
          <nav className="space-y-1">
            {navItems.map((item) => {

              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    flex items-center gap-3
                    px-3 py-2.5
                    rounded-xl
                    text-sm
                    font-medium
                    transition-all
                    relative
                    group

                    ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-transparent'
                    }

                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  {/* Icon */}
                  <span
                    className={`
                      flex-shrink-0
                      ${
                        isActive
                          ? 'text-emerald-600'
                          : 'text-zinc-400 group-hover:text-zinc-600'
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  {(isOpen || isMobileOpen) && (
                    <span className="truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ================================
            User Footer
        ================================= */}
        <div className="border-t border-zinc-100 pt-3">

          <div
            className={`
              flex items-center justify-between px-2

              ${
                isCollapsed
                  ? 'flex-col gap-2'
                  : ''
              }
            `}
          >

            {/* User Information */}
            <div className="flex items-center gap-3 overflow-hidden min-w-0">

              {/* Avatar */}
              <div
                className="
                  w-8 h-8
                  rounded-full
                  bg-emerald-600
                  text-white
                  flex items-center justify-center
                  font-bold text-xs
                  flex-shrink-0
                "
                title={userName}
              >
                {initials}
              </div>

              {/* Name & Email */}
              {(isOpen || isMobileOpen) && (
                <div className="truncate min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900 truncate leading-tight">
                    {userName}
                  </p>

                  <p className="text-xs text-zinc-500 truncate leading-tight">
                    {userEmail}
                  </p>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="
                p-1.5
                text-zinc-400
                hover:text-rose-600
                rounded-lg
                hover:bg-zinc-100
                transition-colors
                flex-shrink-0
              "
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LuLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================================
          Main Content
      ================================= */}
      <div
        className="
          flex-1
          flex flex-col
          min-w-0
          overflow-hidden
          bg-zinc-50/50
          text-zinc-900
        "
      >

        {/* ================================
            Mobile Navbar
        ================================= */}
        <div
          className="
            md:hidden
            flex items-center justify-between
            px-4 py-3
            bg-white
            border-b border-zinc-200
          "
        >
          <span className="font-bold text-lg text-zinc-900">
            Organizer Portal
          </span>

          <button
            onClick={() => setIsMobileOpen(true)}
            className="
              p-2
              rounded-xl
              text-zinc-600
              hover:bg-zinc-100
              transition-colors
            "
            aria-label="Open Sidebar"
          >
            <LuMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;

