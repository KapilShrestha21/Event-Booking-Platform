import { api } from "./client.js";

export const getCustomerDashboard = async () => {
    const response = await api.get('/dashboard/customer');
    
    return response.data;
}

export const getOrganizerDashboard = async () => {
    const response = await api.get('/dashboard/organizer');

    return response.data;
}