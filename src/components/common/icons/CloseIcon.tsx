import { ReactComponent as closeImage } from 'assets/images/icons/close.svg';
import { makeIcon, IconProps } from './icons';

export const CloseIcon = ({ className }: IconProps) => {
  return makeIcon(closeImage, className);
};
