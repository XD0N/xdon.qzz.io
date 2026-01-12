"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { zhCN, enUS } from "date-fns/locale"; 
import { useLanguageStore } from "@/lib/store";
import { dictionary } from "@/lib/dictionary";
import LikeButton from "@/components/LikeButton";
import MessageForm from "@/components/MessageForm";
import { deleteComment } from "@/app/actions";
import { MessageSquare, Trash2, ChevronUp, CornerDownRight, Loader2 } from "lucide-react";

export default function MessageItem({ message, user, isAdmin }) {
  const { lang } = useLanguageStore();
  const t = dictionary[lang]?.messageItem || dictionary.en.messageItem;
  const tForm = dictionary[lang]?.messageform || dictionary.en.messageform;
  const dateLocale = lang === "zh" ? zhCN : enUS; 

  const [isReplyingToRoot, setIsReplyingToRoot] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLiked = message.likes?.some((l) => l.userId === user?.id);
  const replies = message.flatReplies || [];
  const visibleReplies = showAll ? replies : replies.slice(0, 2);

  const canDeleteRoot = isAdmin || (user && user.id === message.userId);

  const handleDelete = async (id) => {
    if (!window.confirm(t?.deleteConfirm)) return; 
    setIsDeleting(true);
    try {
      await deleteComment(id); 
    } catch (error) {
      alert(error.message || tForm?.error || "Error"); // 🚀 使用翻译
      setIsDeleting(false);
    }
  };

  return (
    <li className={`flex gap-4 group ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex-shrink-0">
        <Image
          src={message.userImg || "/placeholder.png"}
          width={40} height={40}
          className="rounded-full aspect-square object-cover flex-shrink-0 border border-muted/20"
          alt={message.userName}
        />
      </div>

      <div className="flex-1 border-b pb-6 border-muted/40 last:border-0 min-w-0">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{message.userName}</span>
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(message.createdAt), { 
                addSuffix: true, 
                locale: dateLocale 
              })}
            </span>
          </div>
          <p className="text-sm mt-1 mb-3 whitespace-pre-wrap leading-relaxed break-words text-foreground/90">
            {message.message}
          </p>
          
          <div className="flex items-center gap-5">
            <LikeButton messageId={message.id} likeCount={message.likes?.length || 0} isLiked={isLiked} />
            <button 
              onClick={() => {
                setIsReplyingToRoot(!isReplyingToRoot);
                setActiveReplyId(null);
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare size={14} /> {t?.reply}
            </button>
            {canDeleteRoot && (
              <button onClick={() => handleDelete(message.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all ml-auto">
                {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} {t?.delete}
              </button>
            )}
          </div>
        </div>

        {isReplyingToRoot && (
          <div className="mt-4 mb-6 p-4 rounded-xl bg-muted/20 border border-muted/30 shadow-sm animate-in fade-in slide-in-from-top-2">
            <MessageForm parentId={message.id} onFinished={() => setIsReplyingToRoot(false)} autoFocus={true}>
              <Image 
                src={user?.imageUrl || "/placeholder.png"} 
                width={32} height={32} 
                className="rounded-full aspect-square object-cover flex-shrink-0" 
                alt="me"
              />
            </MessageForm>
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-4 space-y-5 bg-muted/10 p-4 rounded-lg border border-muted/20">
            {visibleReplies.map((reply) => {
              const isReplyLiked = reply.likes?.some(l => l.userId === user?.id);
              const canDeleteReply = isAdmin || (user && user.id === reply.userId);

              return (
                <div key={reply.id} className="relative group/reply">
                  <div className="flex gap-3 items-start">
                    <Image 
                      src={reply.userImg || "/placeholder.png"} 
                      width={28} height={28} 
                      className="rounded-full aspect-square object-cover mt-0.5 flex-shrink-0 border-[0.5px] border-muted/30" 
                      alt={reply.userName} 
                    />
                    <div className="flex-1 text-sm min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-bold text-[13px]">{reply.userName}</span>
                        {reply.replyToUser && reply.replyToUser !== message.userName && (
                          <span className="text-[11px] text-blue-500/80">
                             {t?.replyTo} <span className="font-medium">@{reply.replyToUser}</span>
                          </span>
                        )}
                        <span className="text-foreground/90 leading-normal break-words">{reply.message}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.createdAt), { 
                            addSuffix: true, 
                            locale: dateLocale 
                          })}
                        </span>
                        <LikeButton messageId={reply.id} likeCount={reply.likes?.length || 0} isLiked={isReplyLiked} />
                        <button 
                          onClick={() => {
                            setActiveReplyId(activeReplyId === reply.id ? null : reply.id);
                            setIsReplyingToRoot(false);
                          }}
                          className="text-[10px] text-muted-foreground hover:text-foreground font-medium"
                        >
                          {t?.reply}
                        </button>
                        {canDeleteReply && (
                          <button onClick={() => handleDelete(reply.id)} className="text-[10px] text-red-400 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                            {t?.delete}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {activeReplyId === reply.id && (
                    <div className="mt-3 ml-10 p-3 rounded-lg bg-background/50 border border-muted/30 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <MessageForm parentId={reply.id} onFinished={() => setActiveReplyId(null)} autoFocus={true}>
                        <Image 
                          src={user?.imageUrl || "/placeholder.png"} 
                          width={24} height={24} 
                          className="rounded-full aspect-square object-cover flex-shrink-0" 
                          alt="me"
                        />
                      </MessageForm>
                    </div>
                  )}
                </div>
              );
            })}

            {replies.length > 2 && (
              <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-600 pl-10 mt-2">
                {showAll ? (
                  <><ChevronUp size={14} /> {t?.collapse}</>
                ) : (
                  <><CornerDownRight size={14} /> {t?.viewAll?.replace("{count}", replies.length)}</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}