import type React from 'react'
import type { AnyRoute } from '@tanstack/react-router'

export type LayoutComponentProps = {
  children?: React.ReactNode
}

export interface LayoutProps extends LayoutComponentProps {
  banner?: React.ReactNode
  toc?: React.ReactNode
  menus?: Menus
}

export interface LayoutContentProps extends LayoutComponentProps {
  banner?: React.ReactNode
  toc?: React.ReactNode
}

export type Menus = AnyRoute[] | readonly AnyRoute[]

export type MenuProps = {
  menus: Menus
}

export { Layout } from './layout'
export { Header } from './header'
export { Banner } from './components/banner'
