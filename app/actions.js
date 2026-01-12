"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. 创建内容 (留言 & 评论)
// ==========================================

// A. 创建留言板留言
export async function createMessage(formData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.message.create({
    data: {
      message: formData.get("message"),
      userId: user.id,
      userName: user.username || user.firstName,
      userImg: user.imageUrl,
    },
  });
  revalidatePath("/guestbook"); // 请修改为你留言板的实际路径
}

// B. 👇 新增：创建文章评论
export async function createComment(formData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const text = formData.get("text");
  const slug = formData.get("postSlug");
  const parentId = formData.get("parentId"); // 👈 获取 parentId

  await prisma.comment.create({
    data: {
      content: text,
      blogSlug: slug,
      userId: user.id,
      userName: user.username || user.firstName,
      userImg: user.imageUrl,
      // 👇 如果有 parentId 就存进去，没有就是 undefined (即 null)
      parentId: parentId || undefined, 
    },
  });
  
  revalidatePath(`/blog/${slug}`); 
}

export async function deleteComment(commentId) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized: 请先登录");

  // 1. 获取环境变量中的管理员 ID 列表
  const adminIds = process.env.ADMIN_USER_ID?.split(",") || [];

  // 2. 查找评论
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new Error("评论不存在");

  // 3. 严格权限校验：是评论作者 OR 是管理员
  const isOwner = comment.userId === user.id;
  const isAdmin = adminIds.includes(user.id);

  if (!isOwner && !isAdmin) {
    throw new Error("Forbidden: 你没有权限删除此评论");
  }

  // 4. 执行删除 (Prisma 会根据 schema 配置处理级联删除)
  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePath(`/blog/${comment.blogSlug}`);
  return { success: true };
}

// ==========================================
// 2. 删除内容 (管理员)
// ==========================================

export async function deleteMessage(formData) {
  const user = await currentUser();
  if (!user || user.id !== process.env.ADMIN_USER_ID) throw new Error("Unauthorized");

  await prisma.message.delete({ where: { id: formData.get("messageId") } });
  revalidatePath("/guestbook");
}

// (如果需要，你可以仿照上面写 deleteComment)

// ==========================================
// 3. 👇 核心：万能点赞 (Toggle Like)
// ==========================================

export async function toggleLike(formData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized: 请先登录");

  // 获取表单传来的 ID (三个里面只会有一个有值)
  const messageId = formData.get("messageId");
  const commentId = formData.get("commentId");
  const postSlug = formData.get("postSlug");

  // 1. 定义查询条件 (Where) 和 创建数据 (Data)
  let whereClause = {};
  let dataClause = { userId: user.id };
  let path = "";

  if (messageId) {
    // 目标：留言板留言
    whereClause = { userId_messageId: { userId: user.id, messageId } };
    dataClause.messageId = messageId;
    path = "/guestbook"; 
  } else if (commentId) {
    // 目标：文章评论
    whereClause = { userId_commentId: { userId: user.id, commentId } };
    dataClause.commentId = commentId;
    const currentSlug = formData.get("currentSlug"); // 为了刷新页面，评论点赞时需要把当前文章slug传回来
    path = `/blog/${currentSlug}`;
  } else if (postSlug) {
    // 目标：文章本身
    whereClause = { userId_postSlug: { userId: user.id, postSlug } };
    dataClause.postSlug = postSlug;
    path = `/blog/${postSlug}`;
  }

  // 2. 数据库操作
  const existingLike = await prisma.like.findUnique({ where: whereClause });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } }); // 取消赞
  } else {
    await prisma.like.create({ data: dataClause }); // 点赞
  }

  // 3. 刷新页面
  revalidatePath(path);
}