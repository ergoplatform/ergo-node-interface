import { ReactComponent as redoImage } from 'assets/images/icons/redo-arrow-symbol.svg';
import { makeIcon, IconProps } from './icons';

export const RedoIcon = ({ className }: IconProps) => {
  return makeIcon(redoImage, className);
};
