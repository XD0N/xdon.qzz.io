"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { zhCN, enUS } from "date-fns/locale"; 
import { useLanguageStore } from "@/lib/store";
import { dictionary } from "@/lib/dictionary";
import LikeButton from "@/components/LikeButton";
import CommentForm from "@/components/CommentForm";
import { deleteComment } from "@/app/actions";
import { MessageSquare, ChevronUp, CornerDownRight, Trash2, Loader2 } from "lucide-react";

export default function CommentItem({ comment, user, slug, isAdmin }) {
  const [isReplyingToRoot, setIsReplyingToRoot] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [mounted, setMounted] = useState(false);

  const { lang } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚀 核心修复：只使用 comment 字典词条
  const t = mounted ? (dictionary[lang]?.comment || dictionary.en.comment) : dictionary.en.comment;
  const dateLocale = lang === "zh" ? zhCN : enUS;

  const isLiked = comment.likes?.some((like) => like.userId === user?.id);
  const replies = comment.flatReplies || []; 
  const totalReplies = replies.length;
  const visibleReplies = showAll ? replies : replies.slice(0, 2);

  const canDeleteRoot = isAdmin || (user && user.id === comment.userId);

  const handleDelete = async (id) => {
    // 🚀 使用 comment 字典中的删除确认语
    if (!window.confirm(t.deleteConfirm)) return;
    
    setDeletingId(id);
    try {
      await deleteComment(id);
    } catch (error) {
      alert(error.message || t.error);
      setDeletingId(null);
    }
  };

  return (
    <div className={`flex gap-4 group ${deletingId === comment.id ? "opacity-50 pointer-events-none" : ""}`}>
      {/* 🚀 修复头像不圆：增加 flex-shrink-0 */}
      <div className="flex-shrink-0">
         <Image
          src={comment.userImg || "/placeholder.png"}
          alt={comment.userName}
          width={40} height={40}
          className="rounded-full aspect-square object-cover flex-shrink-0 border border-muted/20 shadow-sm" 
        />
      </div>

      <div className="flex-1 border-b pb-6 border-muted/40 last:border-0 min-w-0">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{comment.userName}</span>
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { 
                addSuffix: true, 
                locale: dateLocale 
              })}
            </span>
          </div>
          <p className="text-sm text-foreground/90 mt-1 mb-3 leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </p>
          <div className="flex items-center gap-5">
            <LikeButton
              commentId={comment.id}
              currentSlug={slug}
              likeCount={comment.likes?.length || 0}
              isLiked={isLiked}
            />
            <button 
              type="button"
              onClick={() => {
                setIsReplyingToRoot(!isReplyingToRoot);
                setActiveReplyId(null);
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare size={14} /> {t.replyBtn}
            </button>

            {canDeleteRoot && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="flex items-center gap-1 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-all ml-auto"
              >
                {deletingId === comment.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                {t.delete}
              </button>
            )}
          </div>
        </div>

        {isReplyingToRoot && (
           <div className="mt-4 mb-6 p-4 rounded-xl bg-muted/20 border border-muted/30 animate-in fade-in slide-in-from-top-2">
             <CommentForm 
               slug={slug} 
               parentId={comment.id}
               placeholder={`${t.replyTo} ${comment.userName}...`}
               onFinished={() => setIsReplyingToRoot(false)}
               autoFocus={true}
             />
           </div>
        )}

        {totalReplies > 0 && (
          <div className="mt-4 bg-muted/10 p-4 rounded-lg border border-muted/20 space-y-5">
            {visibleReplies.map((reply) => {
              const isReplyLiked = reply.likes?.some(l => l.userId === user?.id);
              const canDeleteReply = isAdmin || (user && user.id === reply.userId);

              return (
                <div key={reply.id} className={`relative group/reply ${deletingId === reply.id ? "opacity-40" : ""}`}>
                  <div className="flex gap-3 items-start">
                    {/* 🚀 子评论头像不圆修复 */}
                    <Image
                      src={reply.userImg || "/placeholder.png"}
                      width={28} height={28}
                      className="rounded-full aspect-square object-cover flex-shrink-0 mt-0.5 border-[0.5px] border-muted/30"
                      alt={reply.userName}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                        <span className="font-bold text-[13px]">{reply.userName}</span>
                        {reply.replyToUser && reply.replyToUser !== comment.userName && (
                          <span className="text-[11px] text-muted-foreground">
                             {t.replyTo} <span className="text-blue-500 font-medium">@{reply.replyToUser}</span>
                          </span>
                        )}
                        <span className="text-foreground/90 leading-normal break-words">{reply.content}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1.5">
                         <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt), { 
                              addSuffix: true, 
                              locale: dateLocale 
                            })}
                         </span>
                         <LikeButton
                            commentId={reply.id}
                            currentSlug={slug}
                            likeCount={reply.likes?.length || 0}
                            isLiked={isReplyLiked}
                         />
                         <button 
                           type="button"
                           onClick={() => {
                             setActiveReplyId(activeReplyId === reply.id ? null : reply.id);
                             setIsReplyingToRoot(false);
                           }}
                           className="text-[10px] text-muted-foreground hover:text-foreground font-medium"
                         >
                           {t.replyBtn}
                         </button>

                         {canDeleteReply && (
                          <button
                            onClick={() => handleDelete(reply.id)}
                            className="text-[10px] text-red-400 hover:text-red-500 font-medium opacity-0 group-hover/reply:opacity-100 transition-opacity"
                          >
                            {t.delete}
                          </button>
                        )}
                      </div>

                      {activeReplyId === reply.id && (
                        <div className="mt-3 p-3 rounded-lg bg-background/50 border border-muted/30 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                           <CommentForm 
                             slug={slug} 
                             parentId={reply.id}
                             placeholder={`${t.replyTo} ${reply.userName}...`}
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
                  className="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-600 mt-2 pl-10"
               >
                  {showAll ? (
                    <><ChevronUp size={14} /> {t.collapse}</>
                  ) : (
                    // 🚀 使用 comment 字典中的查看更多文本
                    <><CornerDownRight size={14} /> {t.viewAll.replace("{count}", totalReplies)}</>
                  )}
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}