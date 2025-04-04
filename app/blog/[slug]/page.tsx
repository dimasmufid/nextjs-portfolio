import { notFound } from 'next/navigation'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import BlogContent from 'app/components/BlogContent'

// Define types for code blocks and mermaid diagrams
interface CodeBlockType {
  id: string;
  language: string;
  code: string;
}

interface MermaidDiagramType {
  id: string;
  chart: string;
}

export async function generateStaticParams() {
  const posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  let post = getBlogPosts().find((post) => post.slug === resolvedParams.slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }) {
  const resolvedParams = await params;
  let post = getBlogPosts().find((post) => post.slug === resolvedParams.slug)

  if (!post) {
    notFound()
  }
  
  // Process the markdown content with better handling for code blocks and mermaid
  // Extract code blocks and mermaid diagrams for client-side rendering
  let processedContent = post.content;
  const codeBlocks: CodeBlockType[] = [];
  const mermaidDiagrams: MermaidDiagramType[] = [];
  
  // Extract code blocks
  processedContent = processedContent.replace(/```([\s\S]*?)```/gm, (match, codeContent) => {
    // Check if it's a mermaid diagram
    if (codeContent.trim().startsWith('mermaid')) {
      const id = `mermaid-${mermaidDiagrams.length}`;
      const chart = codeContent.replace('mermaid\n', '');
      mermaidDiagrams.push({ id, chart });
      return `<div class="mermaid-placeholder" data-id="${id}"></div>`;
    }
    
    // Handle other code blocks
    const id = `code-${codeBlocks.length}`;
    let language = '';
    let code = codeContent;
    
    if (codeContent.includes('\n')) {
      language = codeContent.split('\n')[0].trim();
      code = codeContent.replace(/^.*\n/, ''); // Remove first line (language)
    }
    
    codeBlocks.push({ id, language, code });
    return `<div class="code-placeholder" data-id="${id}"></div>`;
  });
  
  // Process other markdown elements
  processedContent = processedContent
    .replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>') // h2
    .replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>') // h3
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
    .replace(/`([^`]+)`/g, '<code>$1</code>') // inline code
    .replace(/\n\n/g, '<br /><br />') // paragraphs
    .replace(/\n/g, ' '); // line breaks within paragraphs

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose">
        <BlogContent 
          content={processedContent} 
          codeBlocks={codeBlocks} 
          mermaidDiagrams={mermaidDiagrams} 
        />
      </article>
    </section>
  )
}
