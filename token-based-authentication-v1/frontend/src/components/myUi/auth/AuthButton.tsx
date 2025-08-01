import React from "react";
import { ClipLoader } from "react-spinners";

interface AuthButtonProps {
  isLoading?: boolean;
  label?: string;
  loadingLabel?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  isLoading = false,
  label,
  loadingLabel,
  type,
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <ClipLoader color="#fff" size={22} />
          {loadingLabel && <span className="ml-2">{loadingLabel}</span>}
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default AuthButton;
