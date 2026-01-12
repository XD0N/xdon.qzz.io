import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogBySlug, getBlogs } from "@/lib/blog";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import LikeButton from "@/components/LikeButton";
import CommentForm from "@/components/CommentForm";
import CommentItem from "@/components/CommentItem";

// 服务端算法：两层平铺重组
function organizeComments(allComments) {
  const commentMap = new Map();
  const roots = [];
  allComments.forEach(c => {
    c.flatReplies = []; 
    c.replyToUser = null; 
    commentMap.set(c.id, c);
  });
  allComments.forEach(c => {
    if (c.parentId) {
      const parent = commentMap.get(c.parentId);
      if (parent) {
        c.replyToUser = parent.userName;
        let root = parent;
        while (root.parentId) {
          const grandParent = commentMap.get(root.parentId);
          if (!grandParent) break;
          root = grandParent;
        }
        if (root) root.flatReplies.push(c);
      }
    } else {
      roots.push(c);
    }
  });
  roots.forEach(root => {
    root.flatReplies.sort((a, b) => {
      const likesA = a.likes?.length || 0;
      const likesB = b.likes?.length || 0;
      if (likesB !== likesA) return likesB - likesA;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  });
  roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return roots;
}

async function getBlogData(slug) {
  const postLikes = await prisma.like.findMany({
    where: { blogSlug: slug },
    select: { userId: true },
  });
  const allCommentsRaw = await prisma.comment.findMany({
    where: { blogSlug: slug },
    orderBy: { createdAt: "asc" },
    include: { likes: true },
  });
  const allComments = JSON.parse(JSON.stringify(allCommentsRaw));
  return { postLikes, comments: organizeComments(allComments) };
}

export default async function Blog({ params }) {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const clerkUser = await currentUser();
  const user = clerkUser ? {
    id: clerkUser.id,
    imageUrl: clerkUser.imageUrl,
    firstName: clerkUser.firstName,
    username: clerkUser.username,
  } : null;

  // 从环境变量读取管理员权限
  const isAdmin = user && process.env.ADMIN_USER_ID?.split(',').includes(user.id);

  const { postLikes, comments } = await getBlogData(slug);
  const isPostLiked = postLikes.some(l => l.userId === user?.id);
  const { metadata, content } = blog;

  return (
    <section className="flex flex-col xl:flex-row pr-8 mx-auto max-w-5xl">
      <aside className="relative hidden pt-14 xl:block xl:w-48">
        <Link href="/blog" className="sticky flex items-center gap-1 py-2 pl-4 pr-5 rounded-full top-10 text-foreground font-semibold bg-[#f2f2f21a] hover:bg-[#f2f2f230] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
      </aside>

      <article className="w-full max-w-3xl mx-auto mt-16 pb-20">
        <header>
          {metadata.image && (
            <div className="relative w-full mb-10 overflow-hidden rounded-lg aspect-[240/135]">
              <Image src={metadata.image} alt={metadata.title || ""} className="object-cover" fill />
            </div>
          )}
          <p className="mb-2 text-sm text-muted-foreground">{metadata.publishedAt} | {metadata.tag}</p>
          <h1 className="mb-2 text-4xl font-bold">{metadata.title}</h1>
          <div className="flex items-center justify-between mb-6 text-muted-foreground">
            <p>{metadata.author}</p>
            <LikeButton blogSlug={slug} likeCount={postLikes.length} isLiked={isPostLiked} />
          </div>
          <p className="text-lg text-muted-foreground">{metadata.summary}</p>
        </header>

        <main className="mt-16 prose prose-invert max-w-none prose-sm sm:prose-base">
          <MDXRemote source={content} />
        </main>

        <hr className="my-12 border-muted" />

        <section id="comments">
          <h3 className="text-2xl font-bold mb-6">Comments</h3>
          <div className="mb-12">
            {user ? (
              <div className="flex items-start gap-4">
                {/* 修复：增加 aspect-square 和 object-cover 防止拉长 */}
                <Image 
                  src={user.imageUrl} 
                  width={40} height={40} 
                  className="rounded-full aspect-square object-cover flex-shrink-0" 
                  alt="avatar"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{user.firstName}</p>
                  <CommentForm slug={slug} autoFocus={false} />
                </div>
              </div>
            ) : <p className="text-center text-muted-foreground">请登录后参与讨论</p>}
          </div>
          <div className="space-y-8">
            {comments.map(c => (
              <CommentItem 
                key={c.id} 
                comment={c} 
                user={user} 
                slug={slug} 
                isAdmin={isAdmin} 
              />
            ))}
          </div>
        </section>
      </article>
    </section>
  );
}

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map(p => ({ slug: p.slug }));
}