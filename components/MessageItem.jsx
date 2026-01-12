"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "@/components/LikeButton";
import MessageForm from "@/components/MessageForm";
import { deleteComment } from "@/app/actions"; // 建议后端统一使用逻辑，或确保有 deleteMessage
import { MessageSquare, Trash2, ChevronUp, CornerDownRight, Loader2 } from "lucide-react";

export default function MessageItem({ message, user, isAdmin }) {
  const [isReplying, setIsReplying] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 计算点赞状态
  const isLiked = message.likes?.some((l) => l.userId === user?.id);
  const replies = message.flatReplies || [];
  const visibleReplies = showAll ? replies : replies.slice(0, 2);

  // 权限判断：管理员或留言所有者
  const canDeleteRoot = isAdmin || (user && user.id === message.userId);

  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除这条留言吗？")) return;
    setIsDeleting(true);
    try {
      // 调用删除 Action
      await deleteComment(id); 
    } catch (error) {
      alert(error.message || "删除失败");
      setIsDeleting(false);
    }
  };

  return (
    <li className={`flex gap-4 group ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
      {/* --- 1. 根留言头像 --- */}
      <div className="flex-shrink-0">
        <Image
          src={message.userImg || "/placeholder.png"}
          width={40}
          height={40}
          className="rounded-full aspect-square object-cover flex-shrink-0 border border-muted/20"
          alt={message.userName}
        />
      </div>

      <div className="flex-1 border-b pb-6 border-muted/40 last:border-0">
        {/* --- 2. 根留言主体 --- */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">{message.userName}</span>
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm mt-1 mb-3 whitespace-pre-wrap leading-relaxed text-foreground/90">
            {message.message}
          </p>
          
          <div className="flex items-center gap-5">
            <LikeButton 
              messageId={message.id} 
              likeCount={message.likes?.length || 0} 
              isLiked={isLiked} 
            />
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare size={14} /> 回复
            </button>

            {/* 管理员/所有者删除按钮 */}
            {canDeleteRoot && (
              <button 
                onClick={() => handleDelete(message.id)}
                className="flex items-center gap-1 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-all ml-auto"
              >
                {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                删除
              </button>
            )}
          </div>
        </div>

        {/* --- 3. 内嵌回复表单（二级专用样式） --- */}
        {isReplying && (
          <div className="mt-4 mb-6 p-4 rounded-xl bg-muted/20 border border-muted/30 shadow-sm animate-in fade-in slide-in-from-top-2">
            <MessageForm 
              parentId={message.id} 
              onFinished={() => setIsReplying(false)}
              autoFocus={true}
            >
              <Image 
                src={user?.imageUrl || "/placeholder.png"} 
                width={32} height={32} 
                className="rounded-full aspect-square object-cover flex-shrink-0" 
                alt="me"
              />
            </MessageForm>
          </div>
        )}

        {/* --- 4. 平铺子回复列表 --- */}
        {replies.length > 0 && (
          <div className="mt-4 space-y-5 bg-muted/10 p-4 rounded-lg border border-muted/20">
            {visibleReplies.map((reply) => {
              const isReplyLiked = reply.likes?.some(l => l.userId === user?.id);
              const canDeleteReply = isAdmin || (user && user.id === reply.userId);

              return (
                <div key={reply.id} className="relative group/reply flex gap-3">
                  <Image 
                    src={reply.userImg || "/placeholder.png"} 
                    width={28} height={28} 
                    className="rounded-full aspect-square object-cover mt-0.5" 
                    alt={reply.userName} 
                  />
                  <div className="flex-1 text-sm">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-bold text-[13px]">{reply.userName}</span>
                      {/* 智能 @ 逻辑 */}
                      {reply.replyToUser && reply.replyToUser !== message.userName && (
                        <span className="text-[11px] text-blue-500/80">
                           回复 <span className="font-medium">@{reply.replyToUser}</span>
                        </span>
                      )}
                      <span className="text-foreground/90 leading-normal">{reply.message}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                      <LikeButton 
                        messageId={reply.id} 
                        likeCount={reply.likes?.length || 0} 
                        isLiked={isReplyLiked} 
                      />
                      {canDeleteReply && (
                        <button 
                          onClick={() => handleDelete(reply.id)}
                          className="text-[10px] text-red-400 opacity-0 group-hover/reply:opacity-100 transition-opacity"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 查看更多按钮 */}
            {replies.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-600 pl-10 mt-2"
              >
                {showAll ? (
                  <><ChevronUp size={14} /> 收起回复</>
                ) : (
                  <><CornerDownRight size={14} /> 查看全部 {replies.length} 条回复</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}