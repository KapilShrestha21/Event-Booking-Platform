// SELECT * automatically retrieves all columns defined in table..
// Public catalog query (Upcoming & Published only)

export const GET_PUBLIC_EVENTS = `
    SELECT id, organizer_id, title, description, venue, total_tickets, available_tickets, price, image_url, status, event_date, created_at
    FROM events
    WHERE status = 'published' 
      AND event_date >= CURRENT_DATE
`;

export const GET_EVENT_BY_ID = `
    SELECT * FROM events WHERE id = $1;
`;

// Organizer internal view (Includes drafts, past, and cancelled events)
export const GET_EVENTS_BY_ORGANIZER_ID = `
    SELECT * FROM events 
    WHERE organizer_id = $1
    ORDER BY created_at DESC;
`;

// Public view of an organizer's active listings
export const GET_PUBLIC_EVENTS_BY_ORGANIZER_ID = `
    SELECT * FROM events 
    WHERE organizer_id = $1 
      AND status = 'published'
      AND event_date >= NOW()
    ORDER BY event_date ASC;
`;

export const CREATE_EVENT = `
  INSERT INTO events (
    organizer_id, 
    title, 
    description, 
    venue, 
    total_tickets, 
    available_tickets,
    price, 
    event_date,
    image_url,
    image_public_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *;
`;

export const UPDATE_EVENT = `
    UPDATE events
    SET
        title           = COALESCE($1, title),
        description     = COALESCE($2, description),
        venue           = COALESCE($3, venue),
        price           = COALESCE($4, price),
        event_date      = COALESCE($5, event_date),
        image_url       = COALESCE($6, image_url),
        image_public_id = COALESCE($7, image_public_id),
        status          = COALESCE($8, status),
        updated_at  = NOW()
    WHERE id = $9 AND organizer_id = $10
    RETURNING *;
`;

export const DELETE_EVENT = `
    DELETE FROM events
    WHERE id = $1 AND organizer_id = $2
    RETURNING *;
`;

export const CANCEL_EVENT = `
    UPDATE events
    SET
        status     = 'cancelled',
        updated_at = NOW()
    WHERE id = $1 AND organizer_id = $2 AND status != 'cancelled'
    RETURNING *;
`;

// Atomic decrement preventing overbooking concurrency
export const DECREMENT_AVAILABLE_TICKETS = `
    UPDATE events
    SET
        available_tickets = available_tickets - $1,
        updated_at        = NOW()
    WHERE id = $2
        AND status = 'published'
        AND available_tickets >= $1
    RETURNING *;
`;

// Atomic increment for handling booking cancellations/refunds
export const INCREMENT_AVAILABLE_TICKETS = `
    UPDATE events
    SET
        available_tickets = LEAST(total_tickets, available_tickets + $1),
        updated_at        = NOW()
    WHERE id = $2 AND status != 'cancelled'
    RETURNING *;
`;