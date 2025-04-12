declare module 'next-mdx-remote/rsc' {
  import { ReactNode } from 'react'
  
  export interface MDXRemoteProps {
    source: string
    components?: Record<string, React.ComponentType<any>>
    options?: {
      parseFrontmatter?: boolean
      mdxOptions?: any
    }
  }
  
  export function MDXRemote(props: MDXRemoteProps): ReactNode
} 