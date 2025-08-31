import { writable, type Writable } from "svelte/store";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

export const toasts: Writable<ToastMessage[]> = writable([]);

let toastId = 0;

export const toastActions = {
  add: (toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${++toastId}`;
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast,
    };

    toasts.update((list) => [...list, newToast]);

    // Auto-dismiss si une durée est définie
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        toastActions.remove(id);
      }, newToast.duration);
    }

    return id;
  },

  remove: (id: string) => {
    toasts.update((list) => list.filter((toast) => toast.id !== id));
  },

  clear: () => {
    toasts.set([]);
  },

  success: (title: string, message?: string) => {
    return toastActions.add({ type: "success", title, message });
  },

  error: (title: string, message?: string) => {
    return toastActions.add({ type: "error", title, message, duration: 8000 });
  },

  warning: (title: string, message?: string) => {
    return toastActions.add({ type: "warning", title, message });
  },

  info: (title: string, message?: string) => {
    return toastActions.add({ type: "info", title, message });
  },
};
