export const CREATE_BOOKING = `
    INSERT INTO bookings (user_id, event_id, quantity, total_price)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
`;

// get all bookings for a specific user
export const GET_USER_BOOKING = `
    SELECT 
        b.id,
        b.quantity,
        b.total_price,
        b.status,
        b.created_at,
        e.id AS event_id,
        e.title AS event_title,
        e.event_date,
        e.venue, 
        e.image_url
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC;
`;

export const GET_BOOKING_BY_ID = `
    SELECT
        b.id,
        b.quantity,
        b.total_price,
        b.status,
        b.created_at,
        e.id AS event_id,
        e.title AS event_title,
        e.event_date,
        e.venue,
        e.image_url
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    WHERE b.id = $1 AND b.user_id = $2;
`;

// cancel a booking
export const CANCEL_BOOKING = `
    UPDATE bookings
    SET 
        status     = 'cancelled',
        updated_at = NOW()
    WHERE id = $1 
        AND user_id = $2
        AND status = 'confirmed'
    RETURNING *;
`;

// restore ticket count when booking is cancelled
export const RESTORE_TICKETS = `
    UPDATE events
    SET 
        available_tickets = LEAST(
            total_tickets, 
            available_tickets + $1
        ),  
        updated_at = NOW()
    WHERE id = $2 
        AND status != 'cancelled';
`;

// available_tickets = LEAST(total_tickets, available_tickets + $1),  // LEAST help to stop the adding  process of ticket if it exceed the total ticket
// LEAST(100, 90) - it will not get pass 100 
