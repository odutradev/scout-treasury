export const PINS = {
    NORMAL: import.meta.env.VITE_PIN_NORMAL,
    ADMIN: import.meta.env.VITE_PIN_ADMIN
};

export type UserRole = 'normal' | 'admin' | null;

export const validatePin = (pin: string): UserRole => {
    if (pin === PINS.ADMIN) return 'admin';
    if (pin === PINS.NORMAL) return 'normal';
    return null;
};