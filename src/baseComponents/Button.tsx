import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function Button({
  onClick,
  loading,
  type = "button",
  className,
  children,
}: {
  onClick?: () => void;
  loading?: boolean;
  type?: "submit" | "reset" | "button";
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={twMerge(
        `bg-black border-white text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`,
        className
      )}
    >
      {children}
    </button>
  );
}
