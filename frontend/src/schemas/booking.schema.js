import { z } from 'zod';

export const bookingFormSchema = z.object({
    event_id: z.coerce
        .number({ required_error: 'Event ID is required' }) // it means value should be given otherwise it will show this error
        .int('Event ID must be an integer')
        .positive('Invalid Event ID'),

    quantity: z.coerce
        .number({ required_error: 'Quantity is required' })
        .int('Quantity should be number')
        .min(1, 'You must book at least 1 ticket')
        .max(20, 'You cannot book more than 20 tickets at a time')
});