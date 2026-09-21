import { GET_ORGANIZER_DASHBOARD_STATS, GET_RECENT_EVENTS_BY_ORGANIZER } from "../../queries/dashboard/organizerDashboard.queries.js";
import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";

export const getOrganizerDashboardService = async (organizerId) => {
    if (!organizerId) {
        throw new AppError('Organizer ID is required to fetch dashboard stats', 400)
    }

    const [statsResult, recentEventsResult] = await Promise.all([
        pool.query(GET_ORGANIZER_DASHBOARD_STATS, [organizerId]),
        pool.query(GET_RECENT_EVENTS_BY_ORGANIZER, [organizerId])
    ]);

    const stats = statsResult.rows[0];

    return {
        summary: {
            total_events: Number(stats.total_events),
            active_events: Number(stats.active_events),
            draft_events: Number(stats.draft_events),
            cancelled_events: Number(stats.cancelled_events),
            total_tickets_created: Number(stats.total_tickets_created),
            available_tickets: Number(stats.available_tickets),
        },
        recent_events: recentEventsResult.rows
    };
};