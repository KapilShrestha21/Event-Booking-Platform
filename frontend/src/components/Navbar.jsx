import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import logo from '/public/logo.svg';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate('/signin');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const dashboardPath =
    user?.role === 'organizer'
      ? '/organizer/dashboard'
      : '/customer/dashboard';

  const accountPath =
    user?.role === 'organizer'
      ? '/organizer/account'
      : '/customer/account';

  return (
    <nav className="border-b border-emerald-100 bg-white/95 text-slate-800 sticky top-0 z-50 backdrop-blur-md shadow-sm">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-emerald-600 flex items-center gap-2 hover:opacity-90 transition"
        >
          <img src={logo} alt="Event Platform Logo" className="w-12 h-12 shrink-0" />
        </Link>

        {/* =========================
            Desktop Navigation
        ========================== */}
        <div className="hidden md:flex items-center gap-6">

          {/* Explore Events */}
          <Link
            to="/events"
            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Explore Events
          </Link>

          {/* Dashboard */}
          {isAuthenticated && (
            <Link
              to={dashboardPath}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {/* Account */}
          {isAuthenticated && (
            <Link
              to={accountPath}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Account
            </Link>
          )}

          {/* Create Event - Organizer Only */}
          {user?.role === "organizer" && (
            <Link
              to="/organizer/events/new"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200/80 transition-all"
            >
              + Create Event
            </Link>
          )}

          {/* Authenticated User */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-emerald-100 pl-6">

              {/* User Name */}
              <span className="text-sm text-emerald-900 font-medium bg-emerald-50/80 border border-emerald-200/60 px-3 py-1 rounded-lg">
                {user?.name}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-95 shadow-sm transition-all"
              >
                Logout
              </button>

            </div>
          ) : (

            /* Guest User */
            <div className="flex items-center gap-3 border-l border-emerald-100 pl-6">

              {/* Sign In */}
              <Link
                to="/signin"
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </Link>

              {/* Sign Up */}
              <Link
                to="/signup"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-95 shadow-sm shadow-emerald-600/20 transition-all"
              >
                Sign Up
              </Link>

            </div>
          )}
        </div>

        {/* =========================
            Mobile Hamburger Button
        ========================== */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {isMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* =========================
          Mobile Menu Drawer
      ========================== */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-lg px-6 py-4 space-y-4 shadow-xl">

          {/* Explore Events */}
          <Link
            to="/events"
            onClick={closeMenu}
            className="block text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Explore Events
          </Link>

          {/* Dashboard */}
          {isAuthenticated && (
            <Link
              to={dashboardPath}
              onClick={closeMenu}
              className="block text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {/* Account */}
          {isAuthenticated && (
            <Link
              to={accountPath}
              onClick={closeMenu}
              className="block text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Account
            </Link>
          )}

          {/* Create Event - Organizer Only */}
          {user?.role === "organizer" && (
            <Link
              to="/organizer/events/new"
              onClick={closeMenu}
              className="block text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              + Create Event
            </Link>
          )}

          {/* =========================
              Mobile Auth Section
          ========================== */}
          <div className="pt-3 border-t border-emerald-100">

            {isAuthenticated ? (

              <div className="space-y-3">

                {/* User Name */}
                <span className="block text-sm text-slate-500 font-medium">
                  {user?.name}
                </span>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Logout
                </button>

              </div>

            ) : (

              <div className="flex flex-col gap-2">

                {/* Sign In */}
                <Link
                  to="/signin"
                  onClick={closeMenu}
                  className="block text-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Sign In
                </Link>

                {/* Sign Up */}
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="block text-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-95 shadow-sm shadow-emerald-600/20 transition-all"
                >
                  Sign Up
                </Link>

              </div>

            )}

          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar