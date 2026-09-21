import { Router } from "express";
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from "../middlewares/validate.middleware.js";
import { bookingIdParamSchema, createBookingSchema } from "../schemas/booking.schema.js";
import { cancelBooking, createBooking, getBookingById, getUserBookings } from "../controllers/booking.controller.js";

const router = Router();

// use authentication to all route
router.use(authenticate);

router.get('/my-bookings', getUserBookings);
router.get('/:id', validate(bookingIdParamSchema), getBookingById);
router.post('/', (req, res, next) => {
    console.log("CONTENT TYPE:", req.headers["content-type"]);
    console.log("REQ BODY:", req.body);
    next();
}, validate(createBookingSchema), createBooking);
router.post('/:id/cancel', validate(bookingIdParamSchema), cancelBooking);

export default router;