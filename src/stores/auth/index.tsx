import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { authStoreDefaultValues } from './defaultValues';

import type { AuthStore } from './types';
import type { UserRole } from '@utils/constants/pins';

const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            auth: authStoreDefaultValues,
            login: (role: UserRole) => 
                set({ 
                    auth: { 
                        isAuthenticated: true, 
                        role 
                    } 
                }),
            logout: () => {
                set({ auth: authStoreDefaultValues });
                localStorage.removeItem('auth-store');
            },
            isAdmin: () => get().auth.role === 'admin',
            canEdit: () => get().auth.role === 'admin'
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useAuthStore;