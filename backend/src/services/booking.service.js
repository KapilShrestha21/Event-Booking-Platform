import pool from "../config/db.js";
import AppError from "../utils/AppError.js";
import { CREATE_BOOKING, GET_USER_BOOKING, CANCEL_BOOKING, RESTORE_TICKETS, GET_BOOKING_BY_ID } from "../queries/booking.queries.js";
import { DECREMENT_AVAILABLE_TICKETS } from '../queries/event.queries.js';

export const createBookingService = async (userId, eventId, quantity) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // reserve tickets and fetch the event price

        const { rows: eventRows } = await client.query(DECREMENT_AVAILABLE_TICKETS, [quantity, eventId])
        const event = eventRows[0];

        if (!event) {
            throw new AppError('Event is sold out, unpublished, or does not exist', 400);
        }

        // compute totalPrize
        const totalPrice = Number(event.price) * Number(quantity);

        // passing all 4 vlues into SQL query array
        const { rows: bookingRows } = await client.query(CREATE_BOOKING, [
            userId,
            eventId,
            quantity,
            totalPrice
        ]);

        await client.query('COMMIT');
        return bookingRows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error
    } finally {
        client.release();
    }
};

export const getUserBookingsService = async (userId) => {
    const { rows } = await pool.query(GET_USER_BOOKING, [userId]);
    return rows;
}

export const getUserBookingByIdService = async (bookingId, userId) => {
    const { rows } = await pool.query(GET_BOOKING_BY_ID, [bookingId, userId]);
    return rows[0];
}

export const cancelBookingService = async (bookingId, userId) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // mark booking as cancelled
        const { rows: bookingRows } = await client.query(
            CANCEL_BOOKING, [bookingId, userId]
        );

        const cancelledBooking = bookingRows[0] // cancelledBooking have the obj of cancel book event

        if (!cancelledBooking) {
            throw new AppError('Booking not found, already cancelled, or unauthorized', 400);
        }

        // add ticket back to event stock
        const { rowCount } =  await client.query(RESTORE_TICKETS, [
            cancelledBooking.quantity,
            cancelledBooking.event_id,
        ])

        if (rowCount === 0) {
            throw new AppError('Failed to restore tickets', 400);
        }

        await client.query('COMMIT');
        return cancelledBooking;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release();
    }
};




/* pool.query will return this - we can extract data accordingly

    {
    rows: [...],
    rowCount: 1,
    command: "UPDATE",
    oid: null,
    fields: [...]
    }
  */


// RETURNING * is what makes PostgreSQL send the affected row's data back in rows[0]; rowCount works even without it.