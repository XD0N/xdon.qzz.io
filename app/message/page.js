import MessageForm from "@/components/MessageForm";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { GuestBookFormLoading, LoadingMessages } from "@/components/LoadingState";
import Messages from "@/components/Messages";
import Image from "next/image";
import LoginTip from "@/components/LoginTip"; 

// 👇 1. 引入通用组件，删掉 MessageDescription
import Description from "@/components/Description"; 

export default async function MessagePage() {
  const user = await currentUser();

  return (
    <div className="flex flex-col w-full gap-20 lg:w-2/3">
      
      {/* 👇 2. 使用通用组件，传入 page="Message" */}
      {/* 它会自动去字典找 message 对应的标题和描述 */}
      <Description page="Message" />

      <Suspense fallback={<GuestBookFormLoading />}>
        {user ? (
          <MessageForm>
            <Image
              src={user.imageUrl}
              width={40}
              height={40}
              alt="user profile image"
              className="rounded-full "
            />
          </MessageForm>
        ) : (
          <LoginTip />
        )}
      </Suspense>

      <Suspense fallback={<LoadingMessages />}>
        <Messages />
      </Suspense>
    </div>
  );
}