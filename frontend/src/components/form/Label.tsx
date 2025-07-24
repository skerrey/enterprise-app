import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className, required }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        twMerge(
          `mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400
          ${required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""}`,
          className,
        ),
      )}
    >
      {children}
    </label>
  );
};

export default Label;
