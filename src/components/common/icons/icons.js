import React from 'react';

import { ReactComponent as copyIcon } from '../../../assets/images/icons/copy.icon.svg';
import { ReactComponent as removeIcon } from '../../../assets/images/icons/remove.svg';

export const makeIcon = (Icon, className) => {
  return <Icon className={className} focusable="false" />;
};

export const CopyIcon = ({ className }) => {
  return makeIcon(copyIcon, className);
};

export const RemoveIcon = ({ className }) => {
  return makeIcon(removeIcon, className);
};
