import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminState {
  // Sidebar state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Notifications
  notificationsCount: number;
  setNotificationsCount: (count: number) => void;
  incrementNotificationsCount: () => void;
  decrementNotificationsCount: () => void;
  clearNotifications: () => void;

  // Persistent filters
  userFilters: {
    status?: string;
    role?: string;
    badge?: string;
    search?: string;
  };
  setUserFilters: (filters: Partial<AdminState['userFilters']>) => void;
  clearUserFilters: () => void;

  tripFilters: {
    status?: string;
    type?: string;
    city?: string;
    dateFrom?: string;
    dateTo?: string;
    priceMin?: number;
    priceMax?: number;
  };
  setTripFilters: (filters: Partial<AdminState['tripFilters']>) => void;
  clearTripFilters: () => void;

  incidentFilters: {
    status?: string;
    type?: string;
    priority?: string;
  };
  setIncidentFilters: (filters: Partial<AdminState['incidentFilters']>) => void;
  clearIncidentFilters: () => void;

  // UI state
  selectedUsers: string[];
  setSelectedUsers: (ids: string[]) => void;
  toggleUserSelection: (id: string) => void;
  clearUserSelection: () => void;

  selectedTrips: string[];
  setSelectedTrips: (ids: string[]) => void;
  toggleTripSelection: (id: string) => void;
  clearTripSelection: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Notifications
      notificationsCount: 0,
      setNotificationsCount: (count) => set({ notificationsCount: count }),
      incrementNotificationsCount: () =>
        set((state) => ({ notificationsCount: state.notificationsCount + 1 })),
      decrementNotificationsCount: () =>
        set((state) => ({
          notificationsCount: Math.max(0, state.notificationsCount - 1),
        })),
      clearNotifications: () => set({ notificationsCount: 0 }),

      // User filters
      userFilters: {},
      setUserFilters: (filters) =>
        set((state) => ({
          userFilters: { ...state.userFilters, ...filters },
        })),
      clearUserFilters: () => set({ userFilters: {} }),

      // Trip filters
      tripFilters: {},
      setTripFilters: (filters) =>
        set((state) => ({
          tripFilters: { ...state.tripFilters, ...filters },
        })),
      clearTripFilters: () => set({ tripFilters: {} }),

      // Incident filters
      incidentFilters: {},
      setIncidentFilters: (filters) =>
        set((state) => ({
          incidentFilters: { ...state.incidentFilters, ...filters },
        })),
      clearIncidentFilters: () => set({ incidentFilters: {} }),

      // Selection
      selectedUsers: [],
      setSelectedUsers: (ids) => set({ selectedUsers: ids }),
      toggleUserSelection: (id) =>
        set((state) => ({
          selectedUsers: state.selectedUsers.includes(id)
            ? state.selectedUsers.filter((userId) => userId !== id)
            : [...state.selectedUsers, id],
        })),
      clearUserSelection: () => set({ selectedUsers: [] }),

      selectedTrips: [],
      setSelectedTrips: (ids) => set({ selectedTrips: ids }),
      toggleTripSelection: (id) =>
        set((state) => ({
          selectedTrips: state.selectedTrips.includes(id)
            ? state.selectedTrips.filter((tripId) => tripId !== id)
            : [...state.selectedTrips, id],
        })),
      clearTripSelection: () => set({ selectedTrips: [] }),
    }),
    {
      name: 'blasira-admin-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userFilters: state.userFilters,
        tripFilters: state.tripFilters,
        incidentFilters: state.incidentFilters,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

