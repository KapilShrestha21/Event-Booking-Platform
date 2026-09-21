import { create } from 'zustand'
import { loginUser, logoutUser, getMe, registerUser, deleteUser as deleteUserApi } from '../api/auth.api.js'

export const useAuthStore = create((set) => ({
    // initial value
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true, // Starts true for app initialization (getMe)    
    isLoading: false,  // Starts false for form submissions (login/register)
    error: null,

    // Save the user and mark them as authenticated.
    setAuth: (user) => set({ user, isAuthenticated: true, error: null }),

    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await registerUser(credentials);
            const user = response?.data?.user || response?.user || response;

            // Automatically log in user in Zustand store
            set({ user, isAuthenticated: true, isLoading: false })

            return user;
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message || 'Registration failed',
                isLoading: false
            });
            throw error;
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await loginUser(credentials);

            const user = response?.data?.user || response?.user || response;

            // it is use to update zustand state which later used to update ui
            set({ user, isAuthenticated: true, isLoading: false })

            // return user is not necessary for updating the UI;
            // Zustand state is already updated above.
            // But returning user lets the calling code use the
            // freshly logged-in user's data immediately, for example
            // to check the user's role.           
            return user;

        } catch (error) {
            set({
                error: error.response?.data?.message || error.message || 'An unexpected error occurred',
                isLoading: false
            });

            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });

        try {
            await logoutUser();

        } catch (error) {
            console.error('Logout failed on server:', error.message);

        } finally {
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
    },

    deleteUser: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await deleteUserApi();

            set({ user: null, isAuthenticated: false, isLoading: false, error: null });

            return response;

        } catch (error) {
            set({
                error:
                    error.response?.data?.message ||
                    error.message ||
                    'Failed to delete account',
                isLoading: false,
            });

            throw error;
        }
    },

    // this is used when a user reload (f5) the browser - react wipe state memory, setting user to null and isAuthentication to false
    // it contact api on startup to verify cookie and restore user in zustand store
    // by hitting getMe() it carries cookies automatically with api, and backend send user data to frontend and that user data is store in zustand store and later used to know who is the user
    checkingCurrentUser: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await getMe(); // Returns response.data from Axios
            const user = response?.data?.user || response?.data;

            set({
                user,
                isAuthenticated: Boolean(user), // if there is user it will be true
                isCheckingAuth: false
            });

        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isCheckingAuth: false
            });
        }
    },

    clearError: () => set({ error: null }),

}));



/*
error came like this from backend

error = {
    response: {
        status: 401,
        data: {
            success: false,
            message: "Invalid email or password"
        }
    }
}
*/