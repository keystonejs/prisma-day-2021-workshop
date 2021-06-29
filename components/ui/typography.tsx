import { HTMLAttributes } from 'react';
import cx from 'classnames';

export function H1({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const classes = cx('text-2xl my-4', className);
  return (
    <h1 className={classes} {...props}>
      {children}
    </h1>
  );
}
