export const GET_CUSTOMER_DASHBOARD_STATS = `
    SELECT
        COUNT(b.id) AS total_bookings,
        COALESCE(SUM(b.quantity), 0) AS total_tickets_bought,
        COALESCE(SUM(b.total_price), 0) AS total_spent,
        COUNT(
            CASE
                WHEN e.event_date > NOW() 
                    AND b.status = 'confirmed' 
                THEN 1 
            END
        ) AS upcoming_events_count

    FROM bookings b
    JOIN events e ON b.event_id = e.id
    WHERE b.user_id = $1
`

export const GET_CUSTOMER_UPCOMING_BOOKINGS = `
    SELECT
        b.id AS booking_id,
        b.quantity,
        b.total_price,
        b.status AS booking_status,
        b.created_at AS booked_at,
        e.id AS event_id,
        e.title,
        e.venue,
        e.event_date,
        e.image_url
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    WHERE b.user_id = $1 AND e.event_date >= NOW()
    ORDER BY e.event_date ASC
    LIMIT 5;
`;