import React from "react";

type Props = {
  size?: number | string;
  className?: string;
};

export default function TelegramWhite({ size = 48, className = "" }: Props) {
  const s = typeof size === "number" ? `${size}` : size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 544 457"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M204.506 428.416C188.306 428.416 191.06 422.3 185.472 406.875L137.839 250.112L504.506 32.583"
        fill="#CBD9E8"
      />
      <path
        d="M204.505 428.416C217.005 428.416 222.526 422.699 229.505 415.916L296.172 351.091L213.013 300.945"
        fill="#AFC9DE"
      />
      <path
        d="M213.006 300.958L414.505 449.829C437.501 462.517 454.093 455.946 459.822 428.483L541.843 41.9709C550.239 8.30424 529.01 -6.97076 507.01 3.01674L25.3847 188.729C-7.49026 201.917 -7.29443 220.258 19.3931 228.429L142.989 267.008L429.126 86.4876C442.635 78.2959 455.035 82.6959 444.86 91.7292"
        fill="white"
      />
    </svg>
  );
}
