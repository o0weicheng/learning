import { cn } from '@/lib/utils'
import type { AlertProps } from '.'
import { AlertContent } from './alert-content'
import { AlertTitle } from './alert-title'

export const Alert = ({ title, type, children, icon }: AlertProps) => {
  let alertColor = ''
  switch (type) {
    case 'primary':
      alertColor = 'bg-primary'
      break
  }
  return (
    <details className={cn(alertColor)}>
      <summary className="flex flex-row flex-wrap gap-1.5 justify-between py-3">
        {icon}
        <div className="flex flex-col">
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertContent>{children}</AlertContent>
        </div>
      </summary>
    </details>
  )
}
