import { z } from "zod";

const emptyToUndefined = (val) => (val === "" || val === null ? undefined : val);

export const createEventSchema = z.object({
    title: z
        .string({ required_error: "Title is required" })
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title cannot exceed 200 characters"),

    description: z.string().trim().optional(),

    venue: z
        .string({ required_error: "Venue is required" })
        .trim()
        .min(1, "Venue is required")
        .max(200, "Venue cannot exceed 200 characters"),

    total_tickets: z.coerce
        .number({ invalid_type_error: "Total tickets must be a number" })
        .int("Total tickets must be a whole integer")
        .min(1, "Must offer at least 1 ticket"),

    price: z.coerce
        .number({ invalid_type_error: 'Price must be a number' })
        .nonnegative('Price cannot be negative'),

    status: z
        .enum(['draft', 'published', 'cancelled'], {
            invalid_type_error: 'Status must be draft, published, or cancelled',
        })
        .default('published'),

    event_date: z.coerce
        .date({ required_error: "Event date is required" })
        .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
        .refine((date) => date > new Date(), {
            message: "Event date must be in future",
        }),

    image_url: z.preprocess(
        emptyToUndefined,
        z
            .string()
            .trim()
            .url("Must be a valid URL (e.g. https://example.com/photo.jpg)")
            .max(500, "URL cannot exceed 500 characters")
            .optional()
    ),

})


// Remove future-date constraint for updates
export const updateEventSchema = createEventSchema
    .extend({
        event_date: z.preprocess(
            emptyToUndefined,
            z.coerce.date({ invalid_type_error: "Invalid date" }).optional()
        ),
    })
    .partial();
