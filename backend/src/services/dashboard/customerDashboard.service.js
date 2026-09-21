import { GET_CUSTOMER_DASHBOARD_STATS, GET_CUSTOMER_UPCOMING_BOOKINGS } from "../../queries/dashboard/customerDashboard.queries.js";
import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";

export const getCustomerDashboardService = async (userId) => {
    if (!userId) {
        throw new AppError('User ID is required to fetch dashboard stats', 400);
    }

    // fetch aggregate stats and upcoming bookings in parallel
    const [statsResult, upcomingBookingsResult] = await Promise.all([
        pool.query(GET_CUSTOMER_DASHBOARD_STATS, [userId]),
        pool.query(GET_CUSTOMER_UPCOMING_BOOKINGS, [userId])
    ]);

    const stats = statsResult.rows[0];

    // format and return dashboard response with combining both queries
    return {
        summary: {
            total_bookings: Number(stats.total_bookings),
            total_tickets_bought: Number(stats.total_tickets_bought),
            total_spent: Number(stats.total_spent),
            upcoming_events_count: Number(stats.upcoming_events_count),
        },
        upcoming_events: upcomingBookingsResult.rows
    };
};