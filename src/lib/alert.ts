import Swal, { SweetAlertIcon } from "sweetalert2";

interface AlertOptions {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  timer?: number;
}

export const showAlert = (options: AlertOptions) => {
  return Swal.fire({
    title: options.title || "",
    text: options.text,
    icon: options.icon || "info",
    showCancelButton: options.showCancelButton ?? true,
    confirmButtonText: options.confirmButtonText || "Có",
    cancelButtonText: options.cancelButtonText || "Hủy",
    confirmButtonColor: options.confirmButtonColor || "#3085d6",
    cancelButtonColor: options.cancelButtonColor || "#d33",
    timer: options.timer,
  });
};
