import React, { ReactNode } from 'react';
import cn from 'classnames';

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body-text1'
  | 'body-text2'
  | 'small-text1'
  | 'small-text2'
  | 'small-text3';

export type TextColor =
  | 'brandOrange'
  | 'purple'
  | 'black'
  | 'spaceGray'
  | 'gray5'
  | 'gray4'
  | 'gray3'
  | 'gray2'
  | 'gray1'
  | 'white'
  | 'orange'
  | 'red'
  | 'green'
  | 'blue'
  | 'blueHover'
  | 'brandOrangeHover'
  | 'brandOrangeActive'
  | 'purpleHover'
  | 'purpleActive';

export type TextComponent = 'span' | 'p' | 'div' | 'h1' | 'label' | 'h2' | 'h3';

interface IText {
  children?: ReactNode;
  variant?: TextVariant;
  xl?: TextVariant;
  lg?: TextVariant;
  md?: TextVariant;
  sm?: TextVariant;
  component?: TextComponent;
  color?: TextColor;
  className?: string;
  dangerouslySetInnerHTML?: any;
  htmlFor?: string;
}

const Text = ({
  children,
  variant,
  component,
  color,
  className,
  dangerouslySetInnerHTML,
  ...props
}: IText) => {
  const currentVariant = variant;

  const Component = component || 'p';

  if (dangerouslySetInnerHTML) {
    return (
      <>
        <Component
          className={cn({ colored: color }, currentVariant, className)}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          {...props}
        />

        <style>{`
          .colored {
            color: var(--${color});
          }
        `}</style>
      </>
    );
  }

  return (
    <Component
      className={cn({ colored: color }, currentVariant, className)}
      {...props}
    >
      {children}
      <style>{`
        .colored {
          color: var(--${color});
        }
      `}</style>
    </Component>
  );
};

export default Text;
