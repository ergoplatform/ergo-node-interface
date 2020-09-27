import React from 'react';
import cn from 'classnames';

const DEFAULT_SIZE = 'l';

export type ButtonSize = 'l' | 'm' | 's';
export type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'round' | 'flat' | 'accent';
export interface IButton {
  variant: ButtonVariant;
  color?: string;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  download?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string;
}

export const Button = ({
  children,
  variant,
  color = 'purple',
  size,
  disabled,
  onClick,
  href,
  download,
  type = 'button',
  className,
}: React.PropsWithChildren<IButton>) => {
  const Component = href ? 'a' : 'button';
  const buttonSize = size || DEFAULT_SIZE;

  return (
    <Component
      type={type || 'button'}
      disabled={disabled}
      className={cn('button', variant, buttonSize, color, className)}
      onClick={onClick}
      href={href}
      download={download}
      target={download ? '_blank' : undefined}
    >
      {children}
    </Component>
  );
};
