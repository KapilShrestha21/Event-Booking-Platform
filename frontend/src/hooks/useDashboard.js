import { useQuery } from "@tanstack/react-query";
import { getCustomerDashboard, getOrganizerDashboard } from "../api/dashboard.api.js";
import { useAuth } from './useAuth.js';

export const dashboardKeys = {
    all: ['dashboard'],
    customerStats: (userId) => [...dashboardKeys.all, 'customerStats', userId],
    organizerStats: (userId) => [...dashboardKeys.all, 'organizerStats', userId]
};

export const useCustomerDashboard = () => {
    const { isAuthenticated, user, isCustomer } = useAuth();

    console.log("Customer dashboard auth:", {
        isAuthenticated,
        user,
        userId: user?.id,
        role: user?.role,
        isCustomer,
    });

    return useQuery({
        queryKey: dashboardKeys.customerStats(user?.id),
        queryFn: getCustomerDashboard,
        enabled: isAuthenticated && !!user && isCustomer,
        staleTime: 1000 * 60 * 5,
    })
}

export const useOrganizerDashboard = () => {
    const { isAuthenticated, user, isOrganizer } = useAuth();

    return useQuery({
        queryKey: dashboardKeys.organizerStats(user?.id),
        queryFn: getOrganizerDashboard,
        enabled: isAuthenticated && !!user && isOrganizer,
        staleTime: 1000 * 60 * 5,
    })
}

// !!user - it says, if there is user i will convert into true
// isAuthenticated && !!user -- true && true