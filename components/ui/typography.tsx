import React, { HTMLAttributes } from 'react';
import cx from 'classnames';

type Alignable = {
  textAlign?: 'center' | 'end';
};

const buildClasses = (
  defaults: string,
  { className, textAlign }: { className?: string } & Alignable
) => {
  return cx(defaults, className, {
    'text-center': textAlign === 'center',
    'text-right': textAlign === 'end',
  });
};

export const H1 = ({
  className,
  children,
  textAlign,
  ...props
}: HTMLAttributes<HTMLElement> & Alignable) => {
  const classes = buildClasses('text-3xl my-4 font-medium', {
    className,
    textAlign,
  });
  return (
    <h1 className={classes} {...props}>
      {children}
    </h1>
  );
}

export const H2 = ({
  className,
  children,
  textAlign,
  ...props
}: HTMLAttributes<HTMLElement> & Alignable) => {
  const classes = buildClasses('text-2xl my-4 font-medium', {
    className,
    textAlign,
  });
  return (
    <h2 className={classes} {...props}>
      {children}
    </h2>
  );
}

export const H3 = ({
  className,
  children,
  textAlign,
  ...props
}: HTMLAttributes<HTMLElement> & Alignable) => {
  const classes = buildClasses('text-2xl my-4 font-light text-gray-800', {
    className,
    textAlign,
  });
  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
}

export const H4 = ({
  className,
  children,
  textAlign,
  ...props
}: HTMLAttributes<HTMLElement> & Alignable) => {
  const classes = buildClasses('text-xl my-4 text-gray-700', {
    className,
    textAlign,
  });
  return (
    <h4 className={classes} {...props}>
      {children}
    </h4>
  );
}

export const H5 = ({
  className,
  children,
  textAlign,
  ...props
}: HTMLAttributes<HTMLElement> & Alignable) => {
  const classes = buildClasses('text-l my-4 font-semibold text-gray-600', {
    className,
    textAlign,
  });
  return (
    <h5 className={classes} {...props}>
      {children}
    </h5>
  );
}

export const H6 = ({
  className,
  children,
  textAlign,
  ...props
}: HTMLAttributes<HTMLElement> & Alignable) => {
  const classes = buildClasses(
    'my-4 uppercase text-sm text-gray-600 font-medium',
    { className, textAlign }
  );
  return (
    <h6 className={classes} {...props}>
      {children}
    </h6>
  );
}

export const P = ({
  className,
  children,
  textAlign,
  ...props
}: HTMLAttributes<HTMLElement> & Alignable) => {
  const classes = buildClasses('my-2', { className, textAlign });
  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
}
