import MessageForm from "@/components/MessageForm";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { GuestBookFormLoading, LoadingMessages } from "@/components/LoadingState";
import Messages from "@/components/Messages";
import Image from "next/image";
import LoginTip from "@/components/LoginTip"; 
import Description from "@/components/Description"; 

export default async function MessagePage() {
  const clerkUser = await currentUser();
  
  // 🚀 获取当前用户和管理员状态
  const user = clerkUser ? {
    id: clerkUser.id,
    imageUrl: clerkUser.imageUrl,
    firstName: clerkUser.firstName || clerkUser.username,
  } : null;

  // 从环境变量读取管理员权限
  const isAdmin = user && process.env.ADMIN_USER_ID?.split(',').includes(user.id);

  return (
    <div className="flex flex-col w-full gap-20 lg:w-2/3">
      <Description page="Message" />

      <Suspense fallback={<GuestBookFormLoading />}>
        {user ? (
          <MessageForm>
            <Image
              src={user.imageUrl}
              width={40}
              height={40}
              alt="user profile image"
              className="rounded-full aspect-square object-cover" 
            />
          </MessageForm>
        ) : (
          <LoginTip />
        )}
      </Suspense>

      <Suspense fallback={<LoadingMessages />}>
        {/* 🚀 传入用户和管理员信息 */}
        <Messages user={user} isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
}