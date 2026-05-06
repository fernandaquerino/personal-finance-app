type EyeOffIconProps = {
  className?: string;
};

export function EyeOffIcon({ className = '' }: EyeOffIconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 2l12 12M6.5 6.5A2 2 0 0 0 10 10M5.2 4.2C3.5 5.1 2 7 2 8s2 4 6 4c1.3 0 2.4-.3 3.3-.8M12 5.5C13.3 6.5 14 8 14 8s-2 4-6 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
