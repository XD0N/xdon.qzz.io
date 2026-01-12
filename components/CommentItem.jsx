"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "@/components/LikeButton";
import CommentForm from "@/components/CommentForm";
import { MessageSquare, ChevronUp, CornerDownRight } from "lucide-react";

export default function CommentItem({ comment, user, slug }) {
  // 状态管理
  const [isReplyingToRoot, setIsReplyingToRoot] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  
  // 展开控制：默认 false
  const [showAll, setShowAll] = useState(false);

  // 数据准备
  const isLiked = comment.likes.some((like) => like.userId === user?.id);
  const replies = comment.flatReplies || []; 
  const totalReplies = replies.length;
  
  // 显示逻辑：如果不展开，显示前 2 条预览
  const visibleReplies = showAll ? replies : replies.slice(0, 2);

  return (
    <div className="flex gap-4">
      {/* 左侧头像 (根评论) */}
      <div className="flex-shrink-0">
         <Image
          src={comment.userImg || "/placeholder.png"}
          alt={comment.userName}
          width={40}
          height={40}
          className="rounded-full" 
        />
      </div>

      {/* 右侧主体 */}
      <div className="flex-1 border-b pb-6 border-muted/40 last:border-0">
        
        {/* --- 根评论 --- */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-foreground/90 mt-1 mb-2 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex items-center gap-5">
            <LikeButton
              commentId={comment.id}
              currentSlug={slug}
              likeCount={comment.likes.length}
              isLiked={isLiked}
            />
            <button 
              type="button"
              onClick={() => setIsReplyingToRoot(!isReplyingToRoot)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare size={14} />
              回复
            </button>
          </div>
        </div>

        {/* 根评论回复框 */}
        {isReplyingToRoot && (
           <div className="mt-3 mb-4">
             <CommentForm 
               slug={slug} 
               parentId={comment.id}
               placeholder={`回复 ${comment.userName}...`}
               onFinished={() => setIsReplyingToRoot(false)}
               autoFocus
             />
           </div>
        )}

        {/* --- 平铺子回复区域 (Level 2) --- */}
        {totalReplies > 0 && (
          <div className="mt-4 bg-muted/30 p-4 rounded-lg space-y-5">
            
            {/* 循环渲染子回复 (两层平铺结构) */}
            {visibleReplies.map((reply) => {
              const isReplyLiked = reply.likes.some(l => l.userId === user?.id);
              
              return (
                <div key={reply.id} className="relative group">
                  <div className="flex gap-3 items-start">
                    <Image
                      src={reply.userImg || "/placeholder.png"}
                      width={24} height={24}
                      className="rounded-full mt-0.5"
                      alt={reply.userName}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                        
                        {/* 1. 回复者名字 */}
                        <span className="font-semibold text-xs">{reply.userName}</span>
                        
                        {/* 2. 👇 关键：回复 @被回复人 */}
                        {/* 只有当回复对象不是根评论作者时才显示，避免废话 */}
                        {reply.replyToUser && reply.replyToUser !== comment.userName && (
                          <span className="text-xs text-muted-foreground">
                             回复 <span className="text-blue-500">@{reply.replyToUser}</span>
                          </span>
                        )}
                        
                        {/* 3. 回复内容 */}
                        <span className="text-foreground/90">{reply.content}</span>
                      </div>

                      {/* 子回复操作栏 */}
                      <div className="flex items-center gap-4 mt-1.5">
                         <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                         </span>
                         
                         <LikeButton
                            commentId={reply.id}
                            currentSlug={slug}
                            likeCount={reply.likes.length}
                            isLiked={isReplyLiked}
                         />

                         <button 
                           type="button"
                           onClick={() => setActiveReplyId(activeReplyId === reply.id ? null : reply.id)}
                           className="text-[10px] text-muted-foreground hover:text-foreground font-medium"
                         >
                           回复
                         </button>
                      </div>

                      {/* 子回复输入框 */}
                      {activeReplyId === reply.id && (
                        <div className="mt-2">
                           <CommentForm 
                             slug={slug} 
                             parentId={reply.id} // 数据上依然指向具体的子评论ID
                             placeholder={`回复 ${reply.userName}...`}
                             onFinished={() => setActiveReplyId(null)}
                             autoFocus
                           />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 展开/收起按钮 */}
            {totalReplies > 2 && (
               <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 mt-2 pl-9"
               >
                  {showAll ? (
                    <>
                      <ChevronUp size={14} /> 收起
                    </>
                  ) : (
                    <>
                      <CornerDownRight size={14} /> 
                      查看全部 {totalReplies} 条回复
                    </>
                  )}
               </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}