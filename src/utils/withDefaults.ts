import React from 'react';

// Прокидывает default параметры в компонент
const withDefaults = <P, DP>(component: React.ComponentType<P>, defaultProps: DP) => {
  type Props = Partial<DP> & Omit<P, keyof DP>;
  // eslint-disable-next-line
  component.defaultProps = defaultProps;
  return component as React.ComponentType<Props>;
};

export default withDefaults;
