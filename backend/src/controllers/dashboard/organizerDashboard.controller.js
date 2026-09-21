import { getOrganizerDashboardService } from "../../services/dashboard/organizerDashboard.service.js";
import catchAsync from "../../utils/catchAsync.js";
import handleResponse from "../../utils/handleResponse.js";

export const getOrganizerDashboard = catchAsync(async (req, res) => {
    const organizerId = req.user.id;
    const dashboardData = await getOrganizerDashboardService(organizerId);

    return handleResponse(res, 200, 'Organizer dashboard metrics retrieved successfully', dashboardData);
});