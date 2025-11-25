export interface DataManagementProps {}

export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    severity?: 'warning' | 'error' | 'info';
}