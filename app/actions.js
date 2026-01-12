"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createMessage(formData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // if (!formData.get("message")) {
  //   return { message: "Please enter something!" };
  // }

  await prisma.message.create({
    data: {
      message: formData.get("message"),
      userId: user.id,
      userName: user.username || user.firstName,
      userImg: user.imageUrl,
    },
  });

  revalidatePath("/message");
}


export async function deleteMessage(formData) {
  const messageId = formData.get("messageId");
  const user = await currentUser();

  // 1. 安全检查：必须登录，且 ID 必须匹配环境变量里的管理员 ID
  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    throw new Error("Unauthorized: You are not the admin!");
  }

  // 2. 数据库删除
  try {
    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    // 3. 刷新页面数据
    revalidatePath("/message");
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
}