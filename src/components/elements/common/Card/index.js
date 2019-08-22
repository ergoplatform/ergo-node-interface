import React from 'react'
import clsx from 'clsx'
import './index.scss'

const Card = ({ color, children, className }) => {
  return (
    <div
      className={clsx(
        {
          card: true,
          'card--green': color === 'green',
          'card--orange': color === 'orange'
        },
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
