import type { LayoutComponentProps } from '..'

export const Banner = ({ children }: LayoutComponentProps) => {
  return children ? (
    <div className="w-full h-24 bg-blue-600 flex items-center justify-center text-white text-2xl">
      {children ?? ''}
    </div>
  ) : null
}
