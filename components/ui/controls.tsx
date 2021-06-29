import { ButtonHTMLAttributes } from 'react';
import cx from 'classnames';

export function Button({
  appearance = 'default',
  size = 'default',
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: 'default' | 'primary';
  size?: 'default' | 'large';
}) {
  const appearanceClasses = {
    default: 'bg-gray-200 hover:bg-gray-300 focus:ring-blue-500 shadow-sm',
    primary:
      'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white shadow-sm',
  };
  const sizeClasses = {
    default: 'py-1 px-3',
    large: 'py-2 px-4',
  };
  const classes = cx(
    appearanceClasses[appearance],
    sizeClasses[size],
    'inline-flex justify-center border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
    className
  );
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
