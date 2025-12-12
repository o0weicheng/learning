import type { AlertBasicProps } from '.'

export const AlertContent = ({ children }: AlertBasicProps) => {
  return <p className="py-1.5 m-0">{children}</p>
}
