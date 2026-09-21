import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyBookings, getBookingById, createBooking, cancelBooking, } from '../api/booking.api.js';
import { eventKeys } from './useEvent.js';
import { useAuth } from './useAuth.js';


export const bookingKeys = {
    all: ['bookings'],
    myList: (userId) => [...bookingKeys.all, 'my-bookings', userId], // it will return  ['bookings', 'my-bookings']
    details: () => [...bookingKeys.all, 'detail'],
    detail: (id) => [...bookingKeys.details(), id] // it became ['bookings', 'detail', 15]
}

// -------- Queries ----------
export const useMyBookings = () => {
    const { user, isAuthenticated, isCustomer } = useAuth();

    return useQuery({
        queryKey: bookingKeys.myList(user?.id),
        queryFn: getMyBookings,
        enabled:
            isAuthenticated &&
            !!user?.id &&
            isCustomer,
        staleTime: 1000 * 60 * 3, // fresh for 3 minutes
    });
};

export const useBookingById = (id) => {
    return useQuery({
        queryKey: bookingKeys.detail(id),
        queryFn: () => getBookingById(id),
        enabled: !!id, // safety check: won't run until id is defined
    });
};

// -------- Mutation ---------
export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();


    return useMutation({
        mutationFn: (data) => createBooking(data),
        onSuccess: () => {
            // Refresh customer bookings AND event list (updates remaining ticket counts)
            queryClient.invalidateQueries({
                queryKey: bookingKeys.myList(user?.id),
            });

            // it doesnot change database 
            // but it saya "Don't trust the cached event data anymore; fetch the latest data from the backend."
            queryClient.invalidateQueries({
                queryKey: eventKeys.all,
            });
        }
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: cancelBooking,

        onSuccess: (_, id) => {
            // Refresh this customer's bookings
            queryClient.invalidateQueries({
                queryKey: bookingKeys.myList(user?.id),
            });

            // Refresh this booking's detail
            queryClient.invalidateQueries({
                queryKey: bookingKeys.detail(id),
            });

            // Refresh events because available tickets changed
            queryClient.invalidateQueries({
                queryKey: eventKeys.all,
            });
        },
    });
};