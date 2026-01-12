"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "@/components/LikeButton";
import CommentForm from "@/components/CommentForm";
import { deleteComment } from "@/app/actions";
import { MessageSquare, ChevronUp, CornerDownRight, Trash2, Loader2 } from "lucide-react";

export default function CommentItem({ comment, user, slug, isAdmin }) {
  const [isReplyingToRoot, setIsReplyingToRoot] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isLiked = comment.likes.some((like) => like.userId === user?.id);
  const replies = comment.flatReplies || []; 
  const totalReplies = replies.length;
  const visibleReplies = showAll ? replies : replies.slice(0, 2);

  const canDeleteRoot = isAdmin || (user && user.id === comment.userId);

  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除这条评论吗？此操作不可逆。")) return;
    
    setDeletingId(id);
    try {
      await deleteComment(id);
    } catch (error) {
      alert(error.message || "删除失败");
      setDeletingId(null);
    }
  };

  return (
    <div className={`flex gap-4 ${deletingId === comment.id ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex-shrink-0">
         <Image
          src={comment.userImg || "/placeholder.png"}
          alt={comment.userName}
          width={40} height={40}
          className="rounded-full aspect-square object-cover" 
        />
      </div>

      <div className="flex-1 border-b pb-6 border-muted/40 last:border-0">
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
              <MessageSquare size={14} /> 回复
            </button>

            {canDeleteRoot && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors ml-auto"
              >
                {deletingId === comment.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                删除
              </button>
            )}
          </div>
        </div>

        {isReplyingToRoot && (
           <div className="mt-3 mb-4">
             <CommentForm 
               slug={slug} 
               parentId={comment.id}
               placeholder={`回复 ${comment.userName}...`}
               onFinished={() => setIsReplyingToRoot(false)}
               autoFocus={true}
             />
           </div>
        )}

        {totalReplies > 0 && (
          <div className="mt-4 bg-muted/30 p-4 rounded-lg space-y-5">
            {visibleReplies.map((reply) => {
              const isReplyLiked = reply.likes.some(l => l.userId === user?.id);
              const canDeleteReply = isAdmin || (user && user.id === reply.userId);

              return (
                <div key={reply.id} className={`relative group ${deletingId === reply.id ? "opacity-40" : ""}`}>
                  <div className="flex gap-3 items-start">
                    <Image
                      src={reply.userImg || "/placeholder.png"}
                      width={24} height={24}
                      className="rounded-full mt-0.5 aspect-square object-cover flex-shrink-0"
                      alt={reply.userName}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                        <span className="font-semibold text-xs">{reply.userName}</span>
                        {reply.replyToUser && reply.replyToUser !== comment.userName && (
                          <span className="text-xs text-muted-foreground">
                             回复 <span className="text-blue-500">@{reply.replyToUser}</span>
                          </span>
                        )}
                        <span className="text-foreground/90">{reply.content}</span>
                      </div>
                      
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

                         {canDeleteReply && (
                          <button
                            onClick={() => handleDelete(reply.id)}
                            className="text-[10px] text-red-400 hover:text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {deletingId === reply.id ? "删除中..." : "删除"}
                          </button>
                        )}
                      </div>

                      {activeReplyId === reply.id && (
                        <div className="mt-2">
                           <CommentForm 
                             slug={slug} 
                             parentId={reply.id}
                             placeholder={`回复 ${reply.userName}...`}
                             onFinished={() => setActiveReplyId(null)}
                             autoFocus={true}
                           />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {totalReplies > 2 && (
               <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 mt-2 pl-9"
               >
                  {showAll ? <><ChevronUp size={14} /> 收起</> : <><CornerDownRight size={14} /> 查看全部 {totalReplies} 条回复</>}
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}