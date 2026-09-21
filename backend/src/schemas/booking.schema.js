import { z } from "zod";

export const createBookingSchema = z.object({
    event_id: z
        .number({ message: 'Event ID is required' })
        .int('Event ID must be an integer')
        .positive('Invalid Event ID'),

    quantity: z
        .number({ message: 'Quantity is required' })
        .int('Quantity must be a whole number')
        .min(1, 'You must book at least 1 ticket')
        .max(10, 'You cannot book more than 10 tickets at a time'),
});

export const bookingIdParamSchema = z.object({
    params: z.object({
        id: z
            .string({ message: 'Booking ID is required' })
            .regex(/^\d+$/, 'Booking ID must be a numeric ID'),
    })
});