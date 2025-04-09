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
    // Headers
    .replace(/^#\s+(.*?)$/gm, '<h1>$1</h1>')
    .replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>')
    .replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>')
    .replace(/^####\s+(.*?)$/gm, '<h4>$1</h4>')
    .replace(/^#####\s+(.*?)$/gm, '<h5>$1</h5>')
    .replace(/^######\s+(.*?)$/gm, '<h6>$1</h6>')
    
    // Blockquotes
    .replace(/^>\s+(.*?)$/gm, '<blockquote>$1</blockquote>')
    
    // Horizontal Rule
    .replace(/^---$/gm, '<hr />')
    
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Images ![alt](url)
    .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>') // Bold + Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/__(.*?)__/g, '<strong>$1</strong>') // Bold alternative
    .replace(/_(.*?)_/g, '<em>$1</em>') // Italic alternative
    
    // Strikethrough
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Ordered lists
    .replace(/^(\d+)\.\s+(.*?)$/gm, '<li>$2</li>')
    
    // Unordered lists
    .replace(/^[-*+]\s+(.*?)$/gm, '<li>$1</li>')
    
    // Task lists
    .replace(/^[-*]\s+\[(x| )\]\s+(.*?)$/gm, '<li class="task-list-item"><input type="checkbox" $1 disabled /> $2</li>')
    
    // Wrap lists in ul/ol tags
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    
    // Tables
    .replace(/^\|(.+)\|$/gm, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim());
      return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>')
    
    // Handle paragraphs (only convert double newlines to paragraphs)
    .replace(/\n\n+/g, '</p><p>')
    
    // Clean up any remaining single newlines
    .replace(/\n/g, ' ');

  // Wrap the entire content in a paragraph if it's not already wrapped
  if (!processedContent.startsWith('<p>')) {
    processedContent = '<p>' + processedContent + '</p>';
  }

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
