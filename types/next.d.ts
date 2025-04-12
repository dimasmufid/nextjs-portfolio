declare module 'next/navigation' {
  export function notFound(): never
  export function redirect(url: string): never
}

declare module 'next/link' {
  import { ComponentProps, ComponentType } from 'react'
  
  export interface LinkProps extends ComponentProps<'a'> {
    href: string
    prefetch?: boolean
    replace?: boolean
    scroll?: boolean
    shallow?: boolean
    passHref?: boolean
  }
  
  const Link: ComponentType<LinkProps>
  export default Link
} 