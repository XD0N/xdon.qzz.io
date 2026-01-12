// components/Messages.jsx
import Image from "next/image";
import prisma from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { currentUser } from "@clerk/nextjs/server"; // 1. 引入 Clerk 用户获取
import DeleteButton from "./DeleteButton"; // 2. 引入刚才写的删除按钮

export default async function Messages() {
  const messages = await getMessages();
  
  // 3. 获取当前登录用户
  const user = await currentUser();
  // 4. 判断是否是管理员 (确保你在 .env 里设置了 ADMIN_USER_ID)
  const isAdmin = user?.id === process.env.ADMIN_USER_ID;

  return (
    <ul className="flex flex-col space-y-2">
      {messages.map((message, index) => (
        // 添加 relative 和 group 类，为了方便定位删除按钮和实现悬停显示
        <li key={message.id} className="relative group">
          <div className="flex items-start gap-3 my-1">
            <div className="flex flex-col items-center flex-shrink-0 gap-2">
              <Image
                src={message.userImg}
                width={40}
                height={40}
                alt="user profile image"
                className="mb-1 rounded-full"
              />
              {index != messages.length - 1 && (
                <div className="w-1 h-3 border-l-2 border-foreground"></div>
              )}
            </div>

            <div className="flex flex-col w-full pr-8"> {/* pr-8 是为了给右边的删除按钮留位置，防止文字盖住按钮 */}
              <div className="flex items-center gap-2">
                <p>{message.userName}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <p className="mt-1 text-xs font-light break-words">
                {message.message}
              </p>
            </div>
            
            {/* 5. 只有管理员才渲染这个区域 */}
            {isAdmin && (
              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <DeleteButton id={message.id} />
              </div>
            )}

          </div>
        </li>
      ))}
    </ul>
  );
}

async function getMessages() {
  const data = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}