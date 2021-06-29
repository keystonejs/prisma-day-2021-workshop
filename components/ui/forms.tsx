import {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';
import classNames from 'classnames';

export function FieldContainer({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const classes = classNames('my-4', className);
  return (
    <div className={classes}>
      <label {...props}>{children}</label>
    </div>
  );
}

export function FieldLabel({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const classes = classNames('inline-block w-36 ' + className);
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export function TextInput({
  size = 'default',
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: 'default' | 'large';
}) {
  const sizeClasses = {
    default: 'p-1',
    large: 'p-2',
  };
  const classes = classNames(
    sizeClasses[size],
    'mt-1 w-56 focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm border-gray-300 rounded-md border',
    className
  );
  return <input type="text" className={classes} {...props} />;
}

export function Checkbox({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const classes = classNames(
    'focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded',
    className
  );
  return <input type="checkbox" className={classes} {...props} />;
}

export function Select({
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const classes = classNames(
    'mt-1 py-1 pl-2 pr-8 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
    className
  );
  return (
    <select className={classes} {...props}>
      {children}
    </select>
  );
}
