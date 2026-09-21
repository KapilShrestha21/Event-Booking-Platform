import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate, Link } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvent.js';
import { useAuth } from '@/hooks/useAuth';

const parseDateParts = (dateString) => {
    if (!dateString) {
        return {
            month: 'TBA',
            day: '--',
            full: 'Date TBA',
        };
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return {
            month: 'TBA',
            day: '--',
            full: 'Date TBA',
        };
    }

    return {
        month: date
            .toLocaleDateString(undefined, { month: 'short' })
            .toUpperCase(),

        day: date.toLocaleDateString(undefined, {
            day: '2-digit',
        }),

        full: date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }),
    };
};

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 300);

    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useEvents(debouncedSearch);

    const { isOrganizer } = useAuth();

    const events = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
            ? data
            : [];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* =====================================================
                HERO
            ====================================================== */}
            <section className="relative overflow-hidden bg-white">

                {/* Decorative background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-100/60 blur-3xl" />

                    <div className="absolute left-10 top-20 h-32 w-32 rounded-full bg-teal-100/50 blur-2xl" />

                    <div className="absolute right-10 top-40 h-40 w-40 rounded-full bg-emerald-100/40 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

                    <div className="mx-auto max-w-3xl text-center">

                        {/* Small label */}
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Discover something happening near you
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Find your next
                            <span className="block text-emerald-600">
                                unforgettable event.
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                            Discover concerts, workshops, conferences and
                            experiences happening around you.
                        </p>

                        {/* Search */}
                        <div className="mx-auto mt-8 max-w-2xl sm:mt-9">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-2
                                    shadow-lg
                                    shadow-slate-200/60
                                    transition-all
                                    focus-within:border-emerald-400
                                    focus-within:ring-4
                                    focus-within:ring-emerald-500/10
                                "
                            >

                                {/* Search icon */}
                                <div className="pl-2 text-slate-400 sm:pl-3">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m21 21-4.35-4.35m2.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </div>

                                {/* Input */}
                                <input
                                    type="text"
                                    aria-label="Search events"
                                    placeholder="Search events, venues, cities..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="
                                        min-w-0
                                        flex-1
                                        border-none
                                        bg-transparent
                                        px-1
                                        py-3
                                        text-sm
                                        font-medium
                                        text-slate-900
                                        outline-none
                                        placeholder:text-slate-400
                                    "
                                />

                                {/* Clear */}
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="
                                            rounded-lg
                                            p-2
                                            text-slate-400
                                            transition
                                            hover:bg-slate-100
                                            hover:text-slate-600
                                        "
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18 18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}

                                {/* Search button */}
                                <button
                                    type="button"
                                    className="
                                        hidden
                                        rounded-xl
                                        bg-emerald-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-emerald-700
                                        sm:block
                                    "
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* =====================================================
                EVENTS SECTION
            ====================================================== */}
            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

                {/* Section Header */}
                <div className="mb-6 flex items-end justify-between sm:mb-7">

                    <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 sm:text-xs">
                            Explore
                        </p>

                        <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                            Upcoming events
                        </h2>

                        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                            Find something worth showing up for.
                        </p>
                    </div>

                    {/* Event count */}
                    <div
                        className="
                            rounded-full
                            border
                            border-slate-200
                            bg-white
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            text-slate-600
                            shadow-sm
                            sm:px-3
                            sm:py-1.5
                            sm:text-xs
                        "
                    >
                        {events.length}{' '}
                        {events.length === 1 ? 'event' : 'events'}
                    </div>
                </div>


                {/* =================================================
                    LOADING STATE
                ================================================== */}
                {isLoading && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">

                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    sm:rounded-2xl
                                "
                            >

                                <div className="h-40 animate-pulse bg-slate-200 sm:h-56" />

                                <div className="space-y-3 p-3 sm:space-y-4 sm:p-5">

                                    <div className="h-2.5 w-16 animate-pulse rounded bg-slate-200 sm:h-3 sm:w-24" />

                                    <div className="h-4 w-full animate-pulse rounded bg-slate-200 sm:h-5 sm:w-4/5" />

                                    <div className="h-2.5 w-2/3 animate-pulse rounded bg-slate-200 sm:h-3" />

                                    <div className="flex justify-between gap-2 pt-2 sm:pt-3">
                                        <div className="h-7 w-14 animate-pulse rounded-lg bg-slate-200 sm:h-9 sm:w-20" />

                                        <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-200 sm:h-9 sm:w-20" />
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}


                {/* =================================================
                    ERROR STATE
                ================================================== */}
                {isError && (
                    <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                            !
                        </div>

                        <h3 className="font-semibold text-red-900">
                            Unable to load events
                        </h3>

                        <p className="mt-1 text-sm text-red-600">
                            {error?.response?.data?.message ||
                                'Please check back later.'}
                        </p>

                    </div>
                )}


                {/* =================================================
                    EMPTY STATE
                ================================================== */}
                {!isLoading && !isError && events.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                            🔎
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900">
                            No events found
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                            Try another search term or check back later for
                            new events.
                        </p>

                    </div>
                )}


                {/* =================================================
                    EVENT GRID
                    MOBILE  : 2 columns
                    TABLET  : 2 columns
                    DESKTOP : 3 columns
                ================================================== */}
                {!isLoading && !isError && events.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">

                        {events.map((event) => {

                            const eventId = event.id || event._id;

                            const available = Number(
                                event.available_tickets ?? 0
                            );

                            const isSoldOut = available <= 0;

                            const dateParts = parseDateParts(
                                event.event_date
                            );

                            const price = Number(event.price || 0);

                            return (
                                <article
                                    key={eventId}
                                    className="
                                        group
                                        flex
                                        flex-col
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-slate-300
                                        hover:shadow-xl
                                        hover:shadow-slate-200/70
                                        sm:rounded-2xl
                                    "
                                >

                                    {/* =================================
                                        IMAGE
                                    ================================== */}
                                    <Link
                                        to={`/events/${eventId}`}
                                        className="block"
                                    >
                                        <div className="relative h-40 overflow-hidden bg-slate-100 sm:h-56">

                                            {event.image_url ? (
                                                <img
                                                    src={event.image_url}
                                                    alt={event.title}
                                                    className="
                                                        h-full
                                                        w-full
                                                        object-cover
                                                        transition-transform
                                                        duration-500
                                                        group-hover:scale-105
                                                    "
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
                                                    <span className="text-[10px] font-medium text-slate-400 sm:text-sm">
                                                        No image
                                                    </span>
                                                </div>
                                            )}

                                            {/* Image gradient */}
                                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent sm:h-24" />


                                            {/* Date Badge */}
                                            <div
                                                className="
                                                    absolute
                                                    left-2
                                                    top-2
                                                    w-9
                                                    overflow-hidden
                                                    rounded-lg
                                                    bg-white
                                                    text-center
                                                    shadow-lg
                                                    sm:left-4
                                                    sm:top-4
                                                    sm:w-12
                                                    sm:rounded-xl
                                                "
                                            >

                                                <div className="bg-emerald-600 py-0.5 text-[7px] font-bold tracking-wide text-white sm:py-1 sm:text-[9px]">
                                                    {dateParts.month}
                                                </div>

                                                <div className="py-1 text-sm font-extrabold leading-none text-slate-900 sm:py-1.5 sm:text-lg">
                                                    {dateParts.day}
                                                </div>

                                            </div>


                                            {/* Price */}
                                            <div
                                                className="
                                                    absolute
                                                    right-2
                                                    top-2
                                                    rounded-full
                                                    bg-slate-950/85
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    font-bold
                                                    text-white
                                                    backdrop-blur
                                                    sm:right-4
                                                    sm:top-4
                                                    sm:px-3
                                                    sm:py-1.5
                                                    sm:text-xs
                                                "
                                            >
                                                {price === 0
                                                    ? 'Free'
                                                    : `$${price.toFixed(2)}`}
                                            </div>

                                        </div>
                                    </Link>


                                    {/* =================================
                                        CONTENT
                                    ================================== */}
                                    <div className="flex-1 p-3 sm:p-5">

                                        {/* Date */}
                                        <p className="text-[9px] font-semibold text-emerald-600 sm:text-xs">
                                            {dateParts.full}
                                        </p>


                                        {/* Title */}
                                        <Link to={`/events/${eventId}`}>
                                            <h3
                                                className="
                                                    mt-1.5
                                                    line-clamp-2
                                                    text-sm
                                                    font-bold
                                                    leading-snug
                                                    text-slate-950
                                                    transition-colors
                                                    group-hover:text-emerald-600
                                                    sm:mt-2
                                                    sm:text-lg
                                                "
                                            >
                                                {event.title}
                                            </h3>
                                        </Link>


                                        {/* Venue */}
                                        {event.venue && (
                                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 sm:mt-3 sm:gap-2 sm:text-sm">

                                                <span className="text-xs sm:text-base">
                                                    📍
                                                </span>

                                                <span className="truncate">
                                                    {event.venue}
                                                </span>

                                            </div>
                                        )}

                                    </div>


                                    {/* =================================
                                        FOOTER
                                    ================================== */}
                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-1.5
                                            border-t
                                            border-slate-100
                                            px-3
                                            py-3
                                            sm:gap-2
                                            sm:px-5
                                            sm:py-4
                                        "
                                    >

                                        {/* Availability */}
                                        {isSoldOut ? (
                                            <span className="text-[9px] font-bold text-red-500 sm:text-xs">
                                                Sold out
                                            </span>
                                        ) : (
                                            <div className="min-w-0">

                                                <p className="text-[7px] font-medium uppercase tracking-wide text-slate-400 sm:text-[10px]">
                                                    Availability
                                                </p>

                                                <p className="truncate text-[9px] font-semibold text-slate-700 sm:text-xs">
                                                    {available} tickets left
                                                </p>

                                            </div>
                                        )}


                                        {/* Organizer */}
                                        {isOrganizer ? (
                                            <span
                                                className="
                                                    rounded-lg
                                                    bg-slate-100
                                                    px-2
                                                    py-1.5
                                                    text-[8px]
                                                    font-semibold
                                                    text-slate-500
                                                    sm:px-3
                                                    sm:py-2
                                                    sm:text-xs
                                                "
                                            >
                                                Organizer
                                            </span>
                                        ) : (

                                            /* Book Button */
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/customer/events/${eventId}/book`
                                                    )
                                                }
                                                disabled={isSoldOut}
                                                className="
                                                    shrink-0
                                                    rounded-lg
                                                    bg-emerald-600
                                                    px-2.5
                                                    py-2
                                                    text-[9px]
                                                    font-bold
                                                    text-white
                                                    shadow-sm
                                                    transition-all
                                                    hover:bg-emerald-700
                                                    hover:shadow-md
                                                    disabled:cursor-not-allowed
                                                    disabled:bg-slate-200
                                                    disabled:text-slate-400
                                                    sm:rounded-xl
                                                    sm:px-4
                                                    sm:py-2.5
                                                    sm:text-xs
                                                "
                                            >
                                                {isSoldOut
                                                    ? 'Sold Out'
                                                    : 'Book Ticket'}
                                            </button>

                                        )}

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}

            </main>
        </div>
    );
};

export default Home;