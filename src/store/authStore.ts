import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { DriveConnection } from '@/types';

interface AuthState {
  user: User | null;
  driveConnections: DriveConnection[];
  activeDriveEmail: string | null;
  setUser: (user: User | null) => void;
  addDriveConnection: (connection: DriveConnection) => void;
  removeDriveConnection: (email: string) => void;
  setActiveDrive: (email: string) => void;
  getActiveDriveToken: () => string | null;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()()
  persist(
    (set, get) => ({
      user: null,
      driveConnections: [],
      activeDriveEmail: null,

      setUser: (user) => set({ user }),

      addDriveConnection: (connection) => {
        set((state) => {
          const existing = state.driveConnections.findIndex(
            (c) => c.email === connection.email
          );

          if (existing !== -1) {
            const updated = [...state.driveConnections];
            updated[existing] = connection;
            return { driveConnections: updated };
          }

          return {
            driveConnections: [...state.driveConnections, connection],
            activeDriveEmail: connection.email,
          };
        });
      },

      removeDriveConnection: (email) => {
        set((state) => ({
          driveConnections: state.driveConnections.filter((c) => c.email !== email),
          activeDriveEmail:
            state.activeDriveEmail === email ? null : state.activeDriveEmail,
        }));
      },

      setActiveDrive: (email) => set({ activeDriveEmail: email }),

      getActiveDriveToken: () => {
        const state = get();
        const active = state.driveConnections.find(
          (c) => c.email === state.activeDriveEmail
        );
        return active?.accessToken || null;
      },

      logout: () =>
        set({
          user: null,
          driveConnections: [],
          activeDriveEmail: null,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        driveConnections: state.driveConnections,
        activeDriveEmail: state.activeDriveEmail,
      }),
    }
  );
