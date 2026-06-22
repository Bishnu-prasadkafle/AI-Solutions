'use client';
import { use, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useFetch } from '@/hooks/useFetch';
import { blogsAPI } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/StateUI';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${MEDIA_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function formatDate(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Parse plain text content into structured blocks
type Block =
  | { type: 'h1' | 'h2' | 'h3'; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullet'; items: string[] }
  | { type: 'numbered'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'code'; text: string };

function parseContent(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let bulletBuffer: string[] = [];
  let numberedBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length) { blocks.push({ type: 'bullet', items: [...bulletBuffer] }); bulletBuffer = []; }
  };
  const flushNumbered = () => {
    if (numberedBuffer.length) { blocks.push({ type: 'numbered', items: [...numberedBuffer] }); numberedBuffer = []; }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { flushBullets(); flushNumbered(); continue; }

    if (trimmed.startsWith('### ')) {
      flushBullets(); flushNumbered();
      const text = trimmed.slice(4);
      blocks.push({ type: 'h3', text, id: text.toLowerCase().replace(/\s+/g, '-') });
    } else if (trimmed.startsWith('## ')) {
      flushBullets(); flushNumbered();
      const text = trimmed.slice(3);
      blocks.push({ type: 'h2', text, id: text.toLowerCase().replace(/\s+/g, '-') });
    } else if (trimmed.startsWith('# ')) {
      flushBullets(); flushNumbered();
      const text = trimmed.slice(2);
      blocks.push({ type: 'h1', text, id: text.toLowerCase().replace(/\s+/g, '-') });
    } else if (trimmed.startsWith('> ')) {
      flushBullets(); flushNumbered();
      blocks.push({ type: 'quote', text: trimmed.slice(2) });
    } else if (trimmed.startsWith('```')) {
      flushBullets(); flushNumbered();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', text: codeLines.join('\n') });
    } else if (/^[-*•]\s/.test(trimmed)) {
      flushNumbered();
      bulletBuffer.push(trimmed.replace(/^[-*•]\s/, ''));
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushBullets();
      numberedBuffer.push(trimmed.replace(/^\d+\.\s/, ''));
    } else {
      flushBullets(); flushNumbered();
      blocks.push({ type: 'paragraph', text: trimmed });
    }
  }
  flushBullets();
  flushNumbered();
  return blocks;
}

// Inline bold/italic renderer
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(64,138,113,0.15)', color: '#B0E4CC' }}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function ContentBlock({ block, index }: { block: Block; index: number }) {
  switch (block.type) {
    case 'h1':
      return (
        <h2 id={block.id} className="text-3xl font-bold text-white mt-12 mb-4 scroll-mt-24" style={{ fontFamily: 'var(--font-display)' }}>
          {renderInline(block.text)}
        </h2>
      );
    case 'h2':
      return (
        <h3 id={block.id} className="text-2xl font-bold text-white mt-10 mb-3 scroll-mt-24" style={{ fontFamily: 'var(--font-display)' }}>
          {renderInline(block.text)}
        </h3>
      );
    case 'h3':
      return (
        <h4 id={block.id} className="text-lg font-semibold text-white mt-8 mb-2 scroll-mt-24" style={{ fontFamily: 'var(--font-display)' }}>
          {renderInline(block.text)}
        </h4>
      );
    case 'paragraph':
      return (
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {renderInline(block.text)}
        </p>
      );
    case 'bullet':
      return (
        <ul className="mb-5 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#408A71' }} />
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    case 'numbered':
      return (
        <ol className="mb-5 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(64,138,113,0.15)', color: '#408A71', border: '1px solid rgba(64,138,113,0.3)' }}>
                {i + 1}
              </span>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote
          className="my-6 pl-5 py-1 text-base italic leading-relaxed"
          style={{ borderLeft: '3px solid #408A71', color: 'var(--text-secondary)' }}>
          {renderInline(block.text)}
        </blockquote>
      );
    case 'code':
      return (
        <pre
          className="my-6 p-5 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed"
          style={{ background: 'rgba(9,20,19,0.8)', border: '1px solid rgba(64,138,113,0.2)', color: '#B0E4CC' }}>
          {block.text}
        </pre>
      );
    default:
      return null;
  }
}

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: blog, loading } = useFetch<any>(() => blogsAPI.get(Number(id)));
  const { data: allBlogsData } = useFetch<any>(() => blogsAPI.list());

  const blocks = useMemo(() => blog?.content ? parseContent(blog.content) : [], [blog?.content]);

  const relatedPosts = useMemo(() => {
    const all: any[] = Array.isArray(allBlogsData)
      ? allBlogsData
      : allBlogsData?.results ?? [];
    const others = all.filter((b: any) => String(b.id) !== String(id));
    const sameCategory = others.filter((b: any) => b.category === blog?.category);
    const rest = others.filter((b: any) => b.category !== blog?.category);
    return [...sameCategory, ...rest].slice(0, 6);
  }, [allBlogsData, id, blog?.category]);

  const coverSrc = blog ? imgSrc(blog.cover_image_url || blog.cover_image) : null;

  return (
    <PublicLayout>
      <section className="section-pad pt-28">

        {/* ── Full-width hero image ── */}
        {!loading && blog && coverSrc && (
          <div className="w-full overflow-hidden mb-10" style={{ maxHeight: 280 }}>
            <img
              src={coverSrc}
              alt={blog.title}
              className="w-full object-cover"
              style={{ height: 'clamp(180px, 22vw, 280px)' }}
            />
          </div>
        )}

        <div className="container-custom">

          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-colors mb-10">
            <ArrowLeft size={15} /> Back to Blog
          </Link>

          {loading && <LoadingSpinner />}

          {!loading && blog && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12 items-start">

              {/* ── Main content ── */}
              <article>
                {/* Category + meta */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  {blog.category && (
                    <span className="badge badge-cyan capitalize">{blog.category.replace('_', ' ')}</span>
                  )}
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Calendar size={11} /> {formatDate(blog.created_at)}
                  </span>
                  {blog.read_time && (
                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <Clock size={11} /> {blog.read_time} min read
                    </span>
                  )}
                  {blog.author_name && (
                    <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <span className="w-5 h-5 rounded-full bg-[var(--accent-dim)] border border-[var(--border)] flex items-center justify-center">
                        <User size={9} className="text-[var(--accent-light)]" />
                      </span>
                      {blog.author_name}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {blog.title}
                </h1>

                {/* Excerpt / lead */}
                {blog.excerpt && (
                  <p className="text-lg leading-relaxed mb-8 pl-4 font-medium" style={{ color: 'var(--accent-light)', borderLeft: '3px solid #408A71' }}>
                    {blog.excerpt}
                  </p>
                )}

                {/* Rendered content */}
                <div>
                  {blocks.length > 0 ? (
                    blocks.map((block, i) => (
                      <ContentBlock key={i} block={block} index={i} />
                    ))
                  ) : (
                    <div
                      className="rounded-2xl p-8 text-center"
                      style={{ background: 'rgba(64,138,113,0.05)', border: '1px dashed rgba(64,138,113,0.2)' }}>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Full article content coming soon.
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="mt-10 pt-6 flex flex-wrap gap-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <Tag size={14} className="text-[var(--text-muted)] mt-0.5" />
                    {blog.tags.map((tag: string, i: number) => (
                      <span key={i} className="badge badge-cyan text-xs">{tag}</span>
                    ))}
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-10 pt-8 flex flex-wrap gap-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link href="/blog" className="btn-ghost inline-flex items-center gap-2">
                    <ArrowLeft size={15} /> All Posts
                  </Link>
                  <Link href="/contact" className="btn-primary inline-flex items-center gap-2 ml-auto">
                    Work With Us <ArrowRight size={15} />
                  </Link>
                </div>
              </article>

              {/* ── Sidebar: Related Posts ── */}
              <aside className="hidden lg:block sticky top-28 space-y-4">

                {/* Author card */}
                {blog.author_name && (
                  <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#408A71' }}>Author</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg,#285A48,#408A71)' }}>
                        {blog.author_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{blog.author_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI-Solutions Team</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Related posts index */}
                {relatedPosts.length > 0 && (
                  <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#408A71' }}>
                      More Articles
                    </p>
                    <div className="space-y-4">
                      {relatedPosts.map((post: any) => {
                        const thumb = imgSrc(post.cover_image_url || post.cover_image);
                        return (
                          <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="flex gap-3 group"
                          >
                            {/* Thumbnail */}
                            <div
                              className="shrink-0 w-16 h-16 rounded-xl overflow-hidden"
                              style={{ border: '1px solid var(--border)' }}
                            >
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center text-xl"
                                  style={{ background: 'rgba(64,138,113,0.1)' }}
                                >
                                  📄
                                </div>
                              )}
                            </div>

                            {/* Text */}
                            <div className="min-w-0">
                              {post.category && (
                                <span
                                  className="text-[10px] font-semibold uppercase tracking-wider"
                                  style={{ color: '#408A71' }}
                                >
                                  {post.category.replace('_', ' ')}
                                </span>
                              )}
                              <p
                                className="text-xs font-medium leading-snug mt-0.5 group-hover:text-white transition-colors line-clamp-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                {post.title}
                              </p>
                              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                                {formatDate(post.created_at)}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <Link
                      href="/blog"
                      className="mt-5 flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
                      style={{ color: '#408A71' }}
                    >
                      View all posts <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </aside>

            </div>
          )}

          {!loading && !blog && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              <p className="text-lg mb-4">Post not found.</p>
              <Link href="/blog" className="btn-ghost inline-flex items-center gap-2">
                <ArrowLeft size={14} /> Back to Blog
              </Link>
            </div>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}
