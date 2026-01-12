import Image from "next/image";
import prisma from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { currentUser } from "@clerk/nextjs/server"; 
import LikeButton from "@/components/LikeButton"; // 1. 引入通用点赞按钮
import DeleteButton from "@/components/DeleteButton"; // 假设你有删除按钮

async function getMessages() {
  const data = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
    // 2. 关键：获取留言时，顺便把“谁给它点了赞”也抓出来
    include: {
      likes: true, 
    },
  });

  return data;
}

export default async function Messages() {
  const messages = await getMessages();
  const user = await currentUser(); // 3. 获取当前登录用户

  return (
    <ul className="flex flex-col space-y-4"> {/* 稍微加大一点间距 */}
      {messages.map((message) => {
        // 4. 计算每条留言的点赞状态
        const likeCount = message.likes.length;
        // 检查 likes 数组里有没有当前用户的 ID
        const isLiked = message.likes.some((like) => like.userId === user?.id);

        return (
          <li key={message.id} className="relative group p-4 border rounded-lg bg-card/50">
             <div className="flex items-start gap-3">
                {/* 头像 */}
                <div className="flex-shrink-0">
                  <Image
                    src={message.userImg || "/placeholder.png"}
                    width={40}
                    height={40}
                    alt="user profile image"
                    className="rounded-full"
                  />
                </div>

                <div className="flex flex-col w-full">
                   {/* 名字和时间 */}
                   <div className="flex items-center gap-2">
                     <p className="font-semibold text-sm">{message.userName}</p>
                     <span className="text-xs text-muted-foreground">
                       {formatDistanceToNow(new Date(message.createdAt), {
                         addSuffix: true,
                       })}
                     </span>
                   </div>

                   {/* 留言内容 */}
                   <p className="mt-1 text-sm font-light break-words mb-3">
                     {message.message}
                   </p>

                   {/* 5. 👇 放置点赞按钮 */}
                   <div className="flex items-center gap-4">
                      <LikeButton 
                        messageId={message.id} // 👈 只要传 messageId，后端就知道是给留言点赞
                        likeCount={likeCount} 
                        isLiked={isLiked} 
                      />
                   </div>
                </div>

                {/* 如果你是管理员，显示删除按钮 */}
                {user?.id === process.env.ADMIN_USER_ID && (
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <DeleteButton id={message.id} />
                   </div>
                )}
             </div>
          </li>
        );
      })}
    </ul>
  );
}