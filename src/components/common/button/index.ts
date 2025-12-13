import type { ComponentSize, ComponentType } from '@/components/types/components'
import { type ReactNode } from 'react'

type GroupClickEventHandler = (event: React.MouseEvent<HTMLButtonElement>, index: number) => void

export type ButtonProps = {
  children: ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  size?: ComponentSize
  type?: ComponentType
  block?: boolean
}

export interface ButtonGroupProps extends Omit<ButtonProps, 'onClick' | 'block'> {
  onClick?: GroupClickEventHandler
}

export { Button } from './button'
export { ButtonGroup } from './button-group'
