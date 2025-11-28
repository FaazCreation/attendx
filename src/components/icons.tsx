import type { SVGProps } from 'react';

export function AttendXIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="12" y1="3" x2="12" y2="1"></line>
      <line x1="12" y1="23" x2="12" y2="21"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
    </svg>
  );
}
