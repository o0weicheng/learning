import type { ComponentType } from '@/components/types/components'
import type React from 'react'

export interface AlertBasicProps {
  children: React.ReactNode
}

export interface AlertProps extends AlertBasicProps {
  type: ComponentType
  icon?: React.ReactNode
  title?: string
}

export { Alert } from './alert'
