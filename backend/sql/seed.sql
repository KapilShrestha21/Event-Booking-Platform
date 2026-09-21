-- clear existing data
TRUNCATE users, events, bookings RESTART IDENTITY CASCADE;

-- insert mock users
INSERT INTO users (name, email, password, role) VALUES
('Kapil', 'kapil@gmail.com', 'kapil123', 'customer'),
('Amish', 'amish@gmail.com', 'amish123', 'organizer');

-- Insert Mock Events
INSERT INTO events (title, description, venue, total_tickets, available_tickets, price, event_date) VALUES
('Coldplay Live 2026', 'World Tour concert', 'Main Arena', 1000, 1000, 150.00, '2026-11-20 20:00:00'),
('Tech Innovation Summit', 'Annual web development summit', 'Convention Center', 300, 300, 49.99, '2026-12-05 09:00:00');