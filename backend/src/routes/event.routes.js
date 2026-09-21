import { Router } from "express";
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { getAllEvents, getEventById, createEvent, updateEvent, cancelEvent, getMyEvents, deleteEvent } from "../controllers/event.controller.js";
import { createEventSchema, updateEventSchema } from "../schemas/event.schema.js";
import { validate } from "../middlewares/validate.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

// --- Public / General Routes ---
router.get('/', getAllEvents);

// --- Specific Authenticated Routes (MUST be above /:id) ---
router.get('/my-events', authenticate, authorize('organizer'), getMyEvents);

// --- Parameterized Routes ---
router.get('/:id', getEventById);

// --- Protected Organizer Routes ---
router.post('/', authenticate, authorize('organizer'), upload.single('image'), validate(createEventSchema), createEvent);
router.patch('/:id', authenticate, authorize('organizer'), upload.single('image'), validate(updateEventSchema), updateEvent);
router.patch('/:id/cancel', authenticate, authorize('organizer'), cancelEvent);
router.delete('/:id/delete', authenticate, authorize('organizer'), deleteEvent);

export default router;
