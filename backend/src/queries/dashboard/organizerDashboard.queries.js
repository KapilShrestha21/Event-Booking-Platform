export const GET_ORGANIZER_DASHBOARD_STATS = `
    SELECT
        COUNT(id) AS total_events,
        COUNT(CASE WHEN status = 'published' THEN 1 END) AS active_events,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) AS draft_events,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_events,
        COALESCE(SUM(total_tickets), 0) AS total_tickets_created,
        COALESCE(SUM(available_tickets), 0) AS available_tickets
    FROM events
    WHERE organizer_id = $1;
`;

export const GET_RECENT_EVENTS_BY_ORGANIZER = `
SELECT id, title, venue, price, total_tickets, available_tickets, status, event_date, created_at   
FROM events
    WHERE organizer_id = $1
    ORDER BY created_at DESC
    LIMIT 5;
`;