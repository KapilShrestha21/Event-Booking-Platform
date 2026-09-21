import { getAllEventsService, getEventByIdService, createEventService, updateEventService, deleteEventService, cancelEventService, getEventsByOrganizerService } from "../services/event.service.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import handleResponse from "../utils/handleResponse.js";

const getAllEvents = catchAsync(async (req, res) => {
    const { search } = req.query;

    const events = await getAllEventsService(search);
    return handleResponse(res, 200, 'Events fetched successfully', events);
});

const getEventById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const event = await getEventByIdService(id);
    return handleResponse(res, 200, 'Event fetched successfully', event);
});

const getMyEvents = catchAsync(async (req, res) => {
    const organizerId = req.user.id; // Extracted safely from JWT
    const events = await getEventsByOrganizerService(organizerId);

    return handleResponse(res, 200, 'Organizer events fetched successfully', events);
});

const createEvent = catchAsync(async (req, res) => {

    const eventData = req.body;
    const organizerId = req.user.id;
    const file = req.file;

    const newEvent = await createEventService(eventData, organizerId, file);

    return handleResponse(res, 201, 'Event created successfully', newEvent)

});

const updateEvent = catchAsync(async (req, res) => {

    const id = req.params.id;           // it is the id of event
    const organizerId = req.user.id;    // it is the id of user who create event(organizerId), and extract from jwt token
    const eventData = req.body;         // data send from frontend
    const file = req.file;

    const updateEvent = await updateEventService(id, eventData, organizerId, file)

    return handleResponse(res, 200, 'Event updated successfully', updateEvent);

});

const cancelEvent = catchAsync(async (req, res) => {
    const { id } = req.params; // it is event id
    const organizerId = req.user.id; // it is id of user who create event, and extract from jwt token

    const cancelledEvent = await cancelEventService(id, organizerId);
    return handleResponse(res, 200, 'Event cancelled successfully', cancelledEvent);
});

const deleteEvent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const organizerId = req.user.id;

    const deletedEvent = await deleteEventService(id, organizerId);
    return handleResponse(res, 200, 'Event deleted successfully', deletedEvent);
});

export {
    getAllEvents,
    getEventById,
    getMyEvents,
    createEvent,
    updateEvent,
    cancelEvent,
    deleteEvent
};