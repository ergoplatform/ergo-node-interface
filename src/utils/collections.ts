import React, { ReactNode } from 'react';

// Устанавливает index в детей
export const setChildrenIndex = (
  children: ReactNode | undefined,
  targetComponents: Array<React.ElementType> = []
): ReactNode | undefined => {
  if (React.Children.count(children) === 0) return [];
  const allowAll = targetComponents.length === 0;
  const clone = (child: React.ReactElement, props = {}) =>
    React.cloneElement(child, props);
  let index = 0;

  return React.Children.map(children, (item) => {
    if (!React.isValidElement(item)) return item;
    index += 1;
    if (allowAll) return clone(item, { index });

    const isAllowed = targetComponents.find((child) => child === item.type);
    if (isAllowed) return clone(item, { index });
    index -= 1;
    return item;
  });
};

export const pickChild = (
  children: ReactNode | undefined,
  targetChild: React.ElementType
): [ReactNode | undefined, ReactNode | undefined] => {
  const target: ReactNode[] = [];
  const withoutTargetChildren = React.Children.map(children, (item) => {
    if (!React.isValidElement(item)) return item;
    if (item.type === targetChild) {
      target.push(item);
      return null;
    }
    return item;
  });

  const targetChildren = target.length >= 0 ? target : undefined;

  return [withoutTargetChildren, targetChildren];
};
