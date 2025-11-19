export interface PinInputProps {
    onComplete: (pin: string) => void;
    error?: boolean;
    disabled?: boolean;
}