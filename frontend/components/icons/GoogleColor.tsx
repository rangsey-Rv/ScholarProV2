import React from "react";

type Props = {
  size?: number | string;
  className?: string;
};

export default function GoogleColor({ size = 24, className = "" }: Props) {
  const s = typeof size === "number" ? `${size}` : size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.9 0 7 1.5 9.2 3.5l6.8-6.8C35.7 2.4 30.2 0 24 0 14 0 5.7 5.3 2 13.1l7.9 6.1C11.8 14.9 17.4 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.2-3.1-.6-4.5H24v8.5h12.7c-.5 2.8-2.1 5.1-4.6 6.7l7 5.4C43.8 38 46.5 31.8 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10 29.2c-1-2.8-1-5.9 0-8.7L2 14.5C-1.3 20.7-1.3 27.8 2 34l8-4.8z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.2 0 11.7-2.1 15.6-5.7l-7-5.4c-2 1.4-4.5 2.2-8.6 2.2-6.6 0-12.3-5.4-13.9-12.6l-7.9 6.1C5.7 42.7 14 48 24 48z"
      />
    </svg>
  );
}
