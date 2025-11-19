import type { UserRole } from '@utils/constants/pins';

export interface AuthStoreData {
    isAuthenticated: boolean;
    role: UserRole;
}

export interface AuthStore {
    auth: AuthStoreData;
    login: (role: UserRole) => void;
    logout: () => void;
    isAdmin: () => boolean;
    canEdit: () => boolean;
}