import { ToastContainer, TypeOptions, ToastPosition, CloseButtonProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastContext {
  type?: TypeOptions;
  defaultClassName?: string;
  position?: ToastPosition;
  rtl?: boolean;
}

// Custom close button component
const CustomCloseButton = ({ closeToast }: CloseButtonProps) => (
  <button
    onClick={closeToast}
    className="ml-2 text-black hover:text-gray-700 focus:outline-none"
    aria-label="Close toast"
  >
    &#10005; {/* X icon */}
  </button>
);

export const Toaster = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false} // Only close via custom button
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName={(context?: ToastContext) => {
        const type = context?.type ?? "default";

        // Icon colors based on type
        const iconColor =
          type === "success"
            ? "bg-green-600"
            : type === "error"
            ? "bg-red-600"
            : type === "warning"
            ? "bg-yellow-700"
            : type === "info"
            ? "bg-blue-500"
            : "bg-gray-400";

        return `
          flex items-center border ${type === "success"
            ? "border-green-600 text-green-600"
            : type === "error"
            ? "border-red-600 text-red-600"
            : type === "warning"
            ? "border-yellow-700 text-yellow-700"
            : "border-gray-300 text-gray-900"
          } 
          bg-white rounded-lg shadow-md px-4 py-2 mb-2 font-medium text-sm w-full max-w-sm
          before:w-3 before:h-3 before:${iconColor} before:rounded-full before:inline-block before:mr-3
        `;
      }}
      className="flex-1"
      closeButton={(props) => <CustomCloseButton {...props} />}
    />
  );
};