import React from 'react';
import clsx from 'clsx';
import './index.scss';

const InfoCard = ({ color, children, className }) => {
  return (
    <div
      className={clsx(
        {
          'info-card': true,
          'info-card--green': color === 'green',
          'info-card--orange': color === 'orange',
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default InfoCard;
