-- Drop existing tables to start fresh during setup
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'organizer')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. EVENTS TABLE
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    organizer_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    venue VARCHAR(200) NOT NULL,
    total_tickets INT NOT NULL CHECK (total_tickets >= 0),
    available_tickets INT NOT NULL CHECK (available_tickets >= 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    status VARCHAR(20) DEFAULT 'published' CHECK(status IN ('draft', 'published', 'cancelled')),
    event_date TIMESTAMPTZ NOT NULL,
    image_url VARCHAR(500),  --- ADDED THIS LINE FOR PHOTOS
    image_public_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    -- Guarantee available tickets never exceed total tickets
    CONSTRAINT check_tickets_quantity CHECK (available_tickets <= total_tickets)
);

-- 3. BOOKINGS TABLE
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- fast lookup for user booking history
CREATE INDEX idx_bookings_user_id ON bookings(user_id);

-- fast lookup for user event attendence logs
CREATE INDEX idx_bookings_event_id ON bookings(event_id);

-- fast queries for listing upcoming non-cancelled events
CREATE INDEX idx_events_date_status ON events(event_date, status);