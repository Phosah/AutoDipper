import { ToastProps } from "../../types";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
  } from "lucide-react";

const Toast = ({ message, type, onClose }: ToastProps) => (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 min-w-64 ${
        type === "success"
          ? "bg-green-500 text-white"
          : type === "error"
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
      }`}
    >
      {type === "success" && <CheckCircle size={20} />}
      {type === "error" && <XCircle size={20} />}
      {type === "info" && <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-xl">
        &times;
      </button>
    </div>
  );
  
export default Toast;