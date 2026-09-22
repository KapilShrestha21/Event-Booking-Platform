import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllEvents, getMyEvents, getEventById, createEvent, updateEvent, cancelEvent, deleteEvent } from '../api/event.api.js';
import { dashboardKeys } from './useDashboard';
import { useAuth } from './useAuth.js';

// Centralized Query Keys
export const eventKeys = {
  all: ['events'],
  publicList: (search = '') => [...eventKeys.all, 'public', search],
  myList: (userId) => [...eventKeys.all, 'my-events', userId],
  details: () => [...eventKeys.all, 'detail'],
  detail: (id) => [...eventKeys.details(), id],
};

// --- READ OPERATIONS (Queries) ---

// Fetch all public events
export const useAllEvents = (searchTerm = '') => {
  return useQuery({
    queryKey: eventKeys.publicList(searchTerm), // it became - ['events', 'public']
    queryFn: () => getAllEvents(searchTerm),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch current user's created events
export const useMyEvents = () => {
  const { user, isAuthenticated, isOrganizer } = useAuth();

  return useQuery({
    queryKey: eventKeys.myList(user?.id), // it became - ['events', 'my-events']
    queryFn: getMyEvents,

    enabled:
      isAuthenticated &&
      !!user?.id &&
      isOrganizer,

    staleTime: 1000 * 60 * 2,
  });
};

// Fetch a single event by ID
export const useEventById = (id) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => getEventById(id),
    enabled: !!id && (options.enabled ?? true),
    ...options,
  });
};

// --- WRITE OPERATIONS (Mutations) ---

// Create new event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();


  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      // refetches event lists & details
      queryClient.invalidateQueries({ queryKey: eventKeys.all });

      // refetches organizer stats & recent events preview
      queryClient.invalidateQueries({ queryKey: dashboardKeys.organizerStats(user?.id) });
    },
  });
};

// Update an existing event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });

      // Refresh organizer dashboard
      queryClient.invalidateQueries({ queryKey: dashboardKeys.organizerStats(user?.id) })
    },
  });
};

// Cancel/delete an event
export const useCancelEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: cancelEvent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.organizerStats(user?.id) });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: deleteEvent,

    onSuccess: (_, id) => {

      // Remove the deleted event's cache FIRST — nothing left for the
      // broader invalidation below to accidentally refetch.
      queryClient.removeQueries({
        queryKey: eventKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: eventKeys.all,
      });


      queryClient.invalidateQueries({
        queryKey: dashboardKeys.organizerStats(user?.id),
      });
    },
  })
}

// --- ALIAS EXPORTS FOR COMPONENT COMPATIBILITY ---
export const useEvents = useAllEvents;

/*
it return back by using useMutation()

const { mutate, 
    isPending, 
    isSuccess,
    isError,
    error, 
    data } = useCreateEvent();

    mutate     → starts the API request
    isPending  → request is currently running
    isError    → request failed
    error      → contains error details
    data       → contains successful API response
*/

/**
  onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.all
      });
    },

    it means

    It tells TanStack Query:
    “The event data may have changed,
     Mark the old cached event data as outdated and fetch fresh data when needed.”
 */