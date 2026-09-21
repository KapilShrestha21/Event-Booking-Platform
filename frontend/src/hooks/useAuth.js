import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    // extract state from zustand store (authStore)
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);  // Added for initial session check
    const isLoading = useAuthStore((state) => state.isLoading);  // form submission state
    const error = useAuthStore((state) => state.error);

    // extract global action from zustand
    const login = useAuthStore((state) => state.login);
    const register = useAuthStore((state) => state.register);
    const logout = useAuthStore((state) => state.logout);
    const deleteUser = useAuthStore((state) => state.deleteUser);
    const checkingCurrentUser = useAuthStore((state) => state.checkingCurrentUser);
    const clearError = useAuthStore((state) => state.clearError);
    const setAuth = useAuthStore((state) => state.setAuth);

    return {
        // auth state
        user,
        isAuthenticated,
        isCheckingAuth,
        isLoading,
        error,

        // auth actions
        login,
        register,
        logout,
        deleteUser,
        checkingCurrentUser,
        setAuth,
        clearError,

        // computed role helpers
        role: user?.role,
        isAdmin: user?.role === 'admin',
        isOrganizer: user?.role === 'organizer' || user?.role === 'admin',
        isCustomer: user?.role === 'customer',
    };
};