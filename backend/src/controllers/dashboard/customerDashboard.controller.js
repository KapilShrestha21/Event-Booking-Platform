import { getCustomerDashboardService } from "../../services/dashboard/customerDashboard.service.js";
import catchAsync from "../../utils/catchAsync.js";
import handleResponse from "../../utils/handleResponse.js";

export const getCustomerDashboard = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const dashboardData = await getCustomerDashboardService(userId);

    return handleResponse(res, 200, 'Customer dashboard metrics retrieved successfully', dashboardData);
});