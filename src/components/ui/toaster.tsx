import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

import {
  HiCheckCircle,
  HiXCircle,
  HiExclamationTriangle,
  HiInformationCircle,
} from "react-icons/hi2"; // Heroicons 2 trong react-icons

const iconMap = {
  success: <HiCheckCircle className="h-6 w-6 text-green-500" />,
  error: <HiXCircle className="h-6 w-6 text-red-500" />,
  warning: <HiExclamationTriangle className="h-6 w-6 text-yellow-500" />,
  info: <HiInformationCircle className="h-6 w-6 text-blue-500" />,
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={3000} swipeDirection="right">
      {toasts.map(
        ({ id, title, description, action, type = "info", ...props }) => {
          return (
            <Toast
              key={id}
              {...props}
              className={`max-w-md w-full bg-white shadow-lg border border-gray-200 rounded-lg grid grid-cols-[auto,1fr,auto] gap-4 p-4 items-center
              ${
                type === "success"
                  ? "border-green-500"
                  : type === "error"
                  ? "border-red-500"
                  : type === "warning"
                  ? "border-yellow-400"
                  : "border-blue-400"
              }`}
            >
              <div className="flex items-center justify-center">
                {iconMap[type] || iconMap.info}
              </div>
              <div className="flex flex-col gap-1">
                {title && (
                  <ToastTitle className="font-semibold text-gray-900">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-gray-600">
                    {description}
                  </ToastDescription>
                )}
              </div>
              {action && <div className="flex items-center">{action}</div>}
              <ToastClose
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              />
            </Toast>
          );
        }
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
