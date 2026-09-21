import { z } from "zod";

const emptyToUndefined = (val) => (val === '' ? undefined : val);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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

    total_tickets: z.preprocess(
        emptyToUndefined,
        z.coerce
            .number({ invalid_type_error: "Total tickets must be a number" })
            .int("Total tickets must be a whole integer")
            .nonnegative('Total tickets cannot be negative')
    ),

    price: z.preprocess(
        emptyToUndefined,
        z.coerce
            .number({ invalid_type_error: 'Price must be a number' })
            .nonnegative('Price cannot be negative')
    ),

    status: z
        .enum(['draft', 'published', 'cancelled'], {
            invalid_type_error: 'Invalid status option',
        })
        .default('published'),

    event_date: z.preprocess(
        emptyToUndefined,
        z.coerce
            .date({ required_error: "Event date is required" })
            .refine((date) => date > new Date(), {
                message: "Event date must be in future",
            })
    ),

    // union is to match either of the value
    image: z.union([
        // case 1 - User uploaded a new file
        z.instanceof(File, { message: "Image is required" })
            .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
            .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
                'Only .jpg, .png, and .webp formats are supported.'
            ),

        // case 2 - User kept an existing Cloudinary URL 
        z.url('Invalid image URL')
    ]),
})


export const updateEventSchema = createEventSchema
    .extend({
        event_date: z.preprocess(
            emptyToUndefined,
            z.coerce.date({ invalid_type_error: "Invalid date" }).optional()
        ),
        // Allow a new File, an existing URL string, or empty string/undefined
        image: z.union([z.instanceof(File), z.string()]).optional(),
    })
    .partial();