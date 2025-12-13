import { cn } from '@/lib/utils'
import React from 'react'
import type { ButtonGroupProps } from '.'

export const ButtonGroup = ({ children, className, onClick, size, type }: ButtonGroupProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (onClick) onClick(event, index)
  }

  return (
    <div className={cn('inline-flex -space-x-px rounded-md', className)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null

        const element = child as React.ReactElement<{
          className: string
          size: ButtonGroupProps['size']
          type: ButtonGroupProps['type']
          onClick: ButtonGroupProps['onClick']
        }>

        return React.cloneElement(element, {
          className: cn(
            element.props.className,
            'rounded-none last:rounded-r-md first:rounded-l-md mx-[0.5px]',
            'focus:z-10',
          ),
          size,
          type,
          onClick: (e) => handleClick(e, index),
        })
      })}
    </div>
  )
}
