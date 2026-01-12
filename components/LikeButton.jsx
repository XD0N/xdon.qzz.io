"use client";

import { toggleLike } from "@/app/actions";
import { Heart } from "lucide-react";
import { useOptimistic, useEffect, useState } from "react"; 
import { useLanguageStore } from "@/lib/store";
import { dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils"; // 🚀 引入 cn 工具函数

export default function LikeButton({
  messageId,
  commentId,
  blogSlug,
  currentSlug,
  likeCount,
  isLiked,
  className, // 🚀 接收外部传入的样式，用于控制字体大小
}) {
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = mounted ? (dictionary[lang]?.comment || dictionary.en.comment) : dictionary.en.comment;

  const [optimisticState, addOptimistic] = useOptimistic(
    { likeCount, isLiked },
    (state, newLikeStatus) => {
      return {
        isLiked: !state.isLiked,
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      };
    }
  );

  return (
    <form
      action={async (formData) => {
        addOptimistic(!optimisticState.isLiked);
        toggleLike(formData);
      }}
    >
      <input type="hidden" name="messageId" value={messageId || ""} />
      <input type="hidden" name="commentId" value={commentId || ""} />
      <input type="hidden" name="postSlug" value={blogSlug || ""} />
      <input type="hidden" name="currentSlug" value={currentSlug || ""} />

      <button
        type="submit"
        className={cn(
          "flex items-center gap-1 transition-colors duration-200",
          // 🚀 默认 text-xs，或者使用传入的字体大小（如 text-[10px]）
          className ? className : "text-[12px] text-muted-foreground hover:text-foreground font-medium", 
          optimisticState.isLiked ? "text-red-500 font-medium" : "text-muted-foreground hover:text-red-500"
        )}
      >
        <Heart
          size={14} 
          className={cn(optimisticState.isLiked ? "fill-current" : "")}
        />
        {/* 🚀 确保这里的行高和回复文字一致 */}
        <span className="leading-none">
          {optimisticState.likeCount > 0 
            ? optimisticState.likeCount 
            : (optimisticState.isLiked ? t?.liked : t?.like)}
        </span>
      </button>
    </form>
  );
}