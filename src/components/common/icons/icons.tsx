import React from 'react';

import { ReactComponent as copyIcon } from '../../../assets/images/icons/copy.icon.svg';
import { ReactComponent as removeIcon } from '../../../assets/images/icons/remove.svg';

export interface IconProps {
  className?: string;
}

export const makeIcon = (Icon: any, className?: string) => {
  return <Icon className={className} focusable="false" />;
};

export const CopyIcon = ({ className }: IconProps) => {
  return makeIcon(copyIcon, className);
};

export const RemoveIcon = ({ className }: IconProps) => {
  return makeIcon(removeIcon, className);
};
