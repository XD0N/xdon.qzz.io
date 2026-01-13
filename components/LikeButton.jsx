"use client";

import { toggleLike } from "@/app/actions";
import { Heart } from "lucide-react";
import { useOptimistic, useEffect, useState } from "react"; 
import { useLanguageStore } from "@/lib/store";
import { dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

export default function LikeButton({
  messageId,
  commentId,
  blogSlug,
  currentSlug,
  likeCount,
  isLiked,
  className, 
}) {
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = mounted ? (dictionary[lang]?.comment || dictionary.en.comment) : dictionary.en.comment;

  const [optimisticState, addOptimistic] = useOptimistic(
    { likeCount, isLiked },
    (state) => ({
      isLiked: !state.isLiked,
      likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
    })
  );

  return (
    <form
      action={async (formData) => {
        addOptimistic(!optimisticState.isLiked);
        await toggleLike(formData); // 🚀 确保异步等待
      }}
    >
      <input type="hidden" name="messageId" value={messageId || ""} />
      <input type="hidden" name="commentId" value={commentId || ""} />
      <input type="hidden" name="postSlug" value={blogSlug || ""} />
      {/* 🚀 关键：currentSlug 用于 actions.js 里的 revalidatePath */}
      <input type="hidden" name="currentSlug" value={currentSlug || ""} />

      <button
        type="submit"
        className={cn(
          "flex items-center gap-1 transition-colors duration-200",
          // 🚀 默认使用 text-[12px]，如果外部传了更小的（如 text-[10px]）则覆盖
          className ? className : "text-[12px]", 
          optimisticState.isLiked 
            ? "text-red-500 font-medium" 
            : "text-muted-foreground hover:text-red-500"
        )}
      >
        <Heart
          size={14} 
          className={cn(optimisticState.isLiked ? "fill-current" : "")}
        />
        <span className="leading-none">
          {optimisticState.likeCount > 0 
            ? optimisticState.likeCount 
            : (optimisticState.isLiked ? t?.liked : t?.like)}
        </span>
      </button>
    </form>
  );
}