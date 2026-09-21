import { cancelBookingService, createBookingService, getUserBookingByIdService, getUserBookingsService } from '../services/booking.service.js';
import catchAsync from '../utils/catchAsync.js';
import handleResponse from '../utils/handleResponse.js';

const createBooking = catchAsync(async (req, res, next) => {
    const { event_id, quantity } = req.body;
    const userId = req.user.id;

    const booking = await createBookingService(userId, event_id, quantity);

    return handleResponse(res, 201, 'Booking created successfully', booking);
});

const getUserBookings = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const bookings = await getUserBookingsService(userId);

    return handleResponse(res, 200, 'Bookings fetched successfully', bookings)
});

const getBookingById = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id } = req.params;

    const bookings = await getUserBookingByIdService(id, userId);

    if (!bookings) {
        throw new AppError('Booking not found', 404);
    }

    return handleResponse(res, 200, 'Bookings fetched successfully', bookings)
});

const cancelBooking = catchAsync(async (req, res, next) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const cancelledBooking = await cancelBookingService(bookingId, userId);

    return handleResponse(res, 200, 'Booking cancelled successfully', cancelledBooking);
})

export {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking
}