import { create } from 'zustand';

export const useUIStore = create((set) => ({
    // mobile navigation menu
    isMobileMenuOpen: false,
    toggleMobileMenu: () =>
        set((state) => ({
            isMobileMenuOpen: !state.isMobileMenuOpen
        })),
    openMobileMenu: () => set({ isMobileMenuOpen: true }),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),

    // dashboard sidebar toggle
    isSidebarCollapsed: false,
    toggleSidebar: () =>
        set((state) => ({
            isSidebarCollapsed: !state.isSidebarCollapsed
        })),
    setSidebarCollapsed: (collapsed) =>
        set({ isSidebarCollapsed: collapsed }),
}));