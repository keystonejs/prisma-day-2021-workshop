import React, { AnchorHTMLAttributes } from 'react';
import NextLink, { LinkProps } from 'next/link';
import classNames from 'classnames';

type Props = { href: LinkProps['href'] } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>;

export const Link = ({ className, href, ...props }: Props) => {
  const classes = classNames(
    'text-blue-600 hover:underline hover:text-blue-800',
    className
  );
  return (
    <NextLink href={href} passHref>
      <a className={classes} {...props} />
    </NextLink>
  );
};
