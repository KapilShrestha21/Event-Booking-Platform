import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { getCustomerDashboard } from '../controllers/dashboard/customerDashboard.controller.js';
import { getOrganizerDashboard } from '../controllers/dashboard/organizerDashboard.controller.js';

const router = Router();

// apply authenticate to all dashboard routes
router.use(authenticate);

router.get('/customer', authorize('customer'), getCustomerDashboard);

router.get('/organizer', authorize('organizer'), getOrganizerDashboard);


export default router;

