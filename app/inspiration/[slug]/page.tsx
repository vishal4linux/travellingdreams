import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, metaDescription: true, excerpt: true },
  });
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blog.findFirst({ where: { slug, isPublished: true } });
  if (!post) notFound();

  return (
    <article className="section-padding bg-surface">
      <div className="container-site max-w-3xl">
        <h1 className="font-display text-4xl font-semibold">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg text-ink-muted">{post.excerpt}</p> : null}
        <div className="prose prose-stone mt-8 max-w-none whitespace-pre-line text-ink-muted">
          {post.content}
        </div>
      </div>
    </article>
  );
}
