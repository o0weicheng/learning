import type { ButtonProps } from '.'
import { cn } from '@/lib/utils'

export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex text-sm rounded-md bg-input/80 items-center justify-center gap-2 text-white cursor-pointer transition whitespace-nowrap hover:bg-input/70 active:ring-3 focus:ring-input/70 h-9 px-6 py-2',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
