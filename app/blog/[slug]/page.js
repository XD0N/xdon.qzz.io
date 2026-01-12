import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogBySlug, getBlogs } from "@/lib/blog";

// 👇 新增的 Imports
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "@/components/LikeButton";
import CommentForm from "@/components/CommentForm";

// 👇 获取文章点赞和评论数据的辅助函数
async function getBlogData(slug) {
  // 1. 获取文章本身的点赞
  const postLikes = await prisma.like.findMany({
    where: { blogSlug: slug },
    select: { userId: true },
  });

  // 2. 获取该文章的评论，并包含每条评论的点赞
  const comments = await prisma.comment.findMany({
    where: { blogSlug: slug },
    orderBy: { createdAt: "desc" },
    include: {
      likes: true, // 获取评论的点赞数据
    },
  });

  return { postLikes, comments };
}

export default async function Blog({ params }) {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // 👇 获取当前用户和数据库数据
  const user = await currentUser();
  const { postLikes, comments } = await getBlogData(slug);

  // 👇 判断当前用户是否给文章点了赞
  const isPostLiked = postLikes.some((like) => like.userId === user?.id);

  const { metadata, content } = blog;
  const { title, summary, image, author, publishedAt, tag } = metadata;

  return (
    <section className="flex flex-col xl:flex-row pr-8 mx-auto max-w-5xl">
      {/* 侧边栏返回按钮 (保持不变) */}
      <aside className="relative hidden pt-14 xl:block xl:w-48">
        <Link
          href="/blog"
          className="sticky flex items-center gap-1 py-2 pl-4 pr-5 rounded-full top-10 text-foreground font-semibold bg-[#f2f2f21a] hover:bg-[#f2f2f230] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
      </aside>

      <article className="w-full max-w-3xl mx-auto mt-16 pb-20">
        <header>
          {image && (
            <div className="relative w-full flex justify-center items-center mb-10 overflow-hidden rounded-lg aspect-[240/135]">
              <Image
                src={image}
                alt={title || ""}
                className="object-cover"
                fill
              />
            </div>
          )}

          <p className="mb-2 text-sm text-muted-foreground">
            {publishedAt ?? ""} | {tag}
          </p>

          <h1 className="mb-2 text-4xl font-bold">{title}</h1>

          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">{author}</p>
            
            {/* 👇 这里放置文章的【点赞按钮】 */}
            <div className="flex items-center gap-2">
                <LikeButton 
                  blogSlug={slug} 
                  likeCount={postLikes.length} 
                  isLiked={isPostLiked} 
                />
            </div>
          </div>

          <p className="">{summary}</p>
        </header>

        <main className="mt-16 prose max-w-none prose-invert prose-p:text-foreground prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-strong:font-bold prose-a:text-blue-400 prose-a:opacity-80 prose-code:text-foreground prose-img:opacity-90 prose-p:tracking-tight prose-p:text-sm prose-li:text-sm">
          <MDXRemote source={content} />
        </main>

        <hr className="my-12 border-muted" />

        {/* 👇 评论区开始 */}
        <section id="comments">
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

          {/* 1. 发表评论表单 */}
          <div className="mb-10">
            {user ? (
               <div className="flex items-start gap-4">
                  <Image 
                    src={user.imageUrl} 
                    alt="Me" 
                    width={40} height={40} 
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.firstName}</p>
                    <CommentForm slug={slug} />
                  </div>
               </div>
            ) : (
               <div className="bg-muted/20 p-4 rounded-lg text-center">
                 <p className="text-sm text-muted-foreground">Please sign in to leave a comment.</p>
               </div>
            )}
          </div>

          {/* 2. 评论列表 */}
          <div className="space-y-8">
            {comments.map((comment) => {
              // 判断当前用户是否赞了这条评论
              const isCommentLiked = comment.likes.some(like => like.userId === user?.id);
              
              return (
                <div key={comment.id} className="flex gap-4">
                   <div className="flex-shrink-0">
                     <Image 
                       src={comment.userImg || "/placeholder-avatar.png"} 
                       alt={comment.userName} 
                       width={40} height={40} 
                       className="rounded-full"
                     />
                   </div>
                   
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-semibold text-sm mr-2">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 mb-2 leading-relaxed">
                        {comment.content}
                      </p>

                      {/* 👇 评论的【点赞按钮】 */}
                      <div className="flex items-center gap-4">
                        <LikeButton 
                          commentId={comment.id}
                          currentSlug={slug} // 传这个是为了点赞后刷新当前页面
                          likeCount={comment.likes.length}
                          isLiked={isCommentLiked}
                        />
                        {/* 这里以后还可以加回复按钮 */}
                        {/* <button className="text-xs text-muted-foreground hover:text-white">Reply</button> */}
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        </section>
        {/* 评论区结束 */}

      </article>
    </section>
  );
}

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}