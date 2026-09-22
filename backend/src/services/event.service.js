import pool from "../config/db.js";
import { GET_PUBLIC_EVENTS, GET_EVENT_BY_ID, CREATE_EVENT, UPDATE_EVENT, CANCEL_EVENT, DECREMENT_AVAILABLE_TICKETS, GET_EVENTS_BY_ORGANIZER_ID, DELETE_EVENT } from "../queries/event.queries.js";
import AppError from "../utils/AppError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

export const getAllEventsService = async (search = '') => {
    let query = GET_PUBLIC_EVENTS;
    const values = [];

    if (search) {
        query += ` AND (title ILIKE $1 OR venue ILIKE $1)`;
        values.push(`%${search}%`);
    }

    query += ` ORDER BY event_date ASC`;

    const { rows } = await pool.query(query, values);
    return rows;
}

export const getEventByIdService = async (id) => {
    const { rows } = await pool.query(GET_EVENT_BY_ID, [id]);

    if (!rows[0]) {
        throw new AppError('Event not found', 404);
    }

    return rows[0];
}

export const getEventsByOrganizerService = async (organizerId) => {
    const { rows } = await pool.query(GET_EVENTS_BY_ORGANIZER_ID, [organizerId]);

    return rows;
}

export const createEventService = async (eventData, organizerId, file) => {

    let imageUrl = null;
    let imagePublicId = null;

    // upload file to cloudinary
    if (file) {
        console.log(file);

        const cloudinaryResponse = await uploadOnCloudinary(file.path);

        if (!cloudinaryResponse) {
            throw new AppError('Failed to upload image to Cloudinary', 500);
        }

        imageUrl = cloudinaryResponse.secure_url;
        imagePublicId = cloudinaryResponse.public_id;
    }

    // extract fields and set available_tickets equal to total_tickets
    const { title, description, venue, total_tickets, price, event_date } = eventData;

    const availableTickets = total_tickets;

    const values = [
        organizerId,
        title,
        description || null,
        venue,
        total_tickets,
        availableTickets,
        price,
        event_date,
        imageUrl,
        imagePublicId,
    ];

    // execute DB operation with failure rollback
    try {
        const { rows } = await pool.query(CREATE_EVENT, values);

        if (!rows[0]) {
            throw new AppError('Failed to create event', 400);
        }

        return rows[0];

    } catch (error) {
        // Failure Rollback: Delete orphaned image from Cloudinary if DB query throws
        if (imagePublicId) {
            await deleteFromCloudinary(imagePublicId);
        }

        throw error
    }
}

export const updateEventService = async (id, eventData, organizerId, file = null) => {

    // fetch existing event to verify ownership and retrieve existing image identifiers
    const existingEvent = await getEventByIdService(id);

    if (!existingEvent) {
        throw new AppError('Event not found', 404);
    }

    if (Number(existingEvent.organizer_id) !== Number(organizerId)) {
        throw new AppError('You are not authorized to edit this event', 403)
    };

    // preserve existing image values by default
    // to keep the old image if the user does not upload a new image
    let imageUrl = existingEvent.image_url;
    let imagePublicId = existingEvent.image_public_id;
    let oldImagePublicId = null;
    let newImagePublicId = null;

    // if a new file was uploaded via Multer, upload it to Cloudinary
    if (file) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);

        if (!cloudinaryResponse) {
            throw new AppError('Failed to upload new event image', 500)
        }

        imageUrl = cloudinaryResponse.secure_url;
        imagePublicId = cloudinaryResponse.public_id;
        newImagePublicId = cloudinaryResponse.public_id;
        oldImagePublicId = existingEvent.image_public_id;
    }

    // update postgreSQL record inside a try...catch for saftey
    try {
        // keep old value if value missing in new field
        const title = eventData.title ?? existingEvent.title;
        const description = eventData.description ?? existingEvent.description;
        const venue = eventData.venue ?? existingEvent.venue;
        const price = eventData.price !== undefined ? eventData.price : existingEvent.price;
        const event_date = eventData.event_date ?? existingEvent.event_date;
        const status = eventData.status ?? existingEvent.status;

        const { rows } = await pool.query(UPDATE_EVENT, [
            title,
            description,
            venue,
            price,
            event_date,
            imageUrl, // add image_url to update parameters
            imagePublicId,
            status,
            id,
            organizerId
        ]);

        if (!rows[0]) {
            throw new AppError('Event not found, cancelled, or you lack permission to update it', 400);
        }

        // Clean up old image from Cloudinary after DB update succeeds
        if (oldImagePublicId) {
            deleteFromCloudinary(oldImagePublicId).then((result) => {
                if (!result) {
                    console.warn(`Could not delete old asset ${oldImagePublicId} from Cloudinary.`);
                }
            });
        }

        return rows[0];
    } catch (error) {

        if (newImagePublicId) {
            await deleteFromCloudinary(newImagePublicId)
        }

        if (error instanceof AppError) throw error;
        throw new AppError(`Database update failed: ${error.message}`, 500);
    }
}

export const deleteEventService = async (id, organizerId) => {
    const existingEvent = await getEventByIdService(id);

    // console.log(typeof id);
    // console.log(typeof organizerId);

    if (existingEvent.organizer_id !== organizerId) {
        throw new AppError('You are not authorized to delete this event', 403);
    }

    const { rows } = await pool.query(DELETE_EVENT, [id, organizerId]);

    if (!rows[0]) {
        throw new AppError('Event not found or could not be deleted', 404);
    }

    // Clean up associated image from Cloudinary
    if (existingEvent.image_public_id) {
        await deleteFromCloudinary(existingEvent.image_public_id);
    }

    return rows[0];
}

export const cancelEventService = async (id, organizerId) => {
    const { rows } = await pool.query(CANCEL_EVENT, [id, organizerId]);

    if (!rows[0]) {
        throw new AppError('Event not found or is already cancelled, or you lack permission to cancel it', 404);
    }

    return rows[0];
}

export const decrementAvailableTicketsService = async (eventId, quantity) => {
    const { rows } = await pool.query(DECREMENT_AVAILABLE_TICKETS, [quantity, eventId]);

    if (!rows[0]) {
        throw new AppError('Purchase failed. Event is unavailable or sold out.', 400);
    }

    return rows[0];
}

