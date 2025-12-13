import type { ButtonProps } from '.'
import { cn } from '@/lib/utils'

const checkButtonSize = (size: ButtonProps['size']) => {
  switch (size) {
    case 'small':
      return ' px-4 py-1 text-xs rounded '
    case 'large':
      return ' px-10 py-2 text-lg '
    default:
      return ' px-6 py-1 '
  }
}

const checkButtonType = (type: ButtonProps['type']) => {
  switch (type) {
    case 'danger':
      return ' bg-red-600/80 hover:bg-red-600/70 active:ring-3 focus:ring-red-600/70 '
    case 'warning':
      return ' bg-yellow-600/80 hover:bg-yellow-600/70 active:ring-3 focus:ring-yellow-600/70 '
    case 'ghost':
      return ' bg-white/10 hover:bg-basic/10 active:ring-3 focus:ring-basic/20 text-basic border '
    default:
      return ''
  }
}

export const Button = ({ children, className, onClick, size, type, block }: ButtonProps) => {
  let buttonStyleSheet = ``

  buttonStyleSheet += checkButtonSize(size)
  buttonStyleSheet += checkButtonType(type)
  if (block) buttonStyleSheet += ' w-full '

  return (
    <button
      className={cn(
        'inline-flex rounded-md bg-basic/80 items-center justify-center gap-2 text-white cursor-pointer transition whitespace-nowrap hover:bg-basic/70 active:ring-3 focus:ring-basic/70',
        className,
        buttonStyleSheet,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
