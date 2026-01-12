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

// =========================================================
// 🧠 核心算法：重组评论数据 (两层平铺结构)
// =========================================================
function organizeComments(allComments) {
  const commentMap = new Map();
  const roots = [];

  // 1. 初始化 Map
  allComments.forEach((c) => {
    c.flatReplies = []; 
    c.replyToUser = null; 
    commentMap.set(c.id, c);
  });

  // 2. 建立关系
  allComments.forEach((c) => {
    if (c.parentId) {
      // --- 子回复处理 ---
      const parent = commentMap.get(c.parentId);
      
      if (parent) {
        // A. 关键需求：记录被回复人的名字
        c.replyToUser = parent.userName;

        // B. 寻找始祖 (Root)
        let root = parent;
        while (root.parentId) {
          const grandParent = commentMap.get(root.parentId);
          if (!grandParent) break;
          root = grandParent;
        }

        // C. 加入到始祖的平铺列表中
        if (root) {
          root.flatReplies.push(c);
        }
      }
    } else {
      // --- 根评论 ---
      roots.push(c);
    }
  });

  // 3. 排序逻辑
  roots.forEach((root) => {
    // 子回复：赞多优先 > 时间正序 (楼层感)
    root.flatReplies.sort((a, b) => {
      const likesA = a.likes?.length || 0;
      const likesB = b.likes?.length || 0;
      if (likesB !== likesA) return likesB - likesA; 
      return new Date(a.createdAt) - new Date(b.createdAt); 
    });
  });

  // 根评论：时间倒序 (最新在最上)
  roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return roots;
}

async function getBlogData(slug) {
  const postLikes = await prisma.like.findMany({
    where: { blogSlug: slug },
    select: { userId: true },
  });

  // 获取所有评论 (扁平获取，不需要嵌套 include)
  const allCommentsRaw = await prisma.comment.findMany({
    where: { blogSlug: slug },
    orderBy: { createdAt: "asc" }, 
    include: { likes: true }, 
  });

  const allComments = JSON.parse(JSON.stringify(allCommentsRaw));
  const comments = organizeComments(allComments);

  return { postLikes, comments };
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

  const { postLikes, comments } = await getBlogData(slug);
  const isPostLiked = postLikes.some((like) => like.userId === user?.id);
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
            <div className="relative w-full flex justify-center items-center mb-10 overflow-hidden rounded-lg aspect-[240/135]">
              <Image src={metadata.image} alt={metadata.title || ""} className="object-cover" fill />
            </div>
          )}
          <p className="mb-2 text-sm text-muted-foreground">{metadata.publishedAt ?? ""} | {metadata.tag}</p>
          <h1 className="mb-2 text-4xl font-bold">{metadata.title}</h1>
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">{metadata.author}</p>
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground hidden sm:inline">给文章点个赞：</span>
               <LikeButton blogSlug={slug} likeCount={postLikes.length} isLiked={isPostLiked} />
            </div>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">{metadata.summary}</p>
        </header>

        <main className="mt-16 prose max-w-none prose-invert prose-p:text-foreground prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-strong:font-bold prose-a:text-blue-400 prose-a:opacity-80 prose-code:text-foreground prose-img:opacity-90 prose-p:tracking-tight prose-p:text-sm prose-li:text-sm">
          <MDXRemote source={content} />
        </main>

        <hr className="my-12 border-muted" />

        <section id="comments">
          <h3 className="text-2xl font-bold mb-6">Comments ({allCommentsCount(comments)})</h3>
          <div className="mb-12">
            {user ? (
               <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image src={user.imageUrl} alt="Me" width={40} height={40} className="rounded-full"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{user.firstName}</p>
                    <CommentForm slug={slug} />
                  </div>
               </div>
            ) : (
               <div className="bg-muted/10 border border-muted p-6 rounded-lg text-center">
                 <p className="text-muted-foreground mb-4">请登录后参与讨论</p>
               </div>
            )}
          </div>

          <div className="space-y-8">
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                user={user} 
                slug={slug} 
              />
            ))}
            {comments.length === 0 && <p className="text-center text-muted-foreground py-10">暂无评论，快来抢沙发！</p>}
          </div>
        </section>
      </article>
    </section>
  );
}

function allCommentsCount(roots) {
  let count = roots.length;
  roots.forEach(root => count += root.flatReplies?.length || 0);
  return count;
}

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}