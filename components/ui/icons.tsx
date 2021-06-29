import { SVGAttributes } from 'react';
import cx from 'classnames';

export function ChevronLeft({
  className,
  ...props
}: SVGAttributes<SVGElement>) {
  const classes = cx('h-6 w-6', className);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classes}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}
