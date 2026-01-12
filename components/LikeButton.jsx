"use client";

import { toggleLike } from "@/app/actions";
import { Heart } from "lucide-react";
import { useOptimistic } from "react"; // 1. 引入这个 Hook

export default function LikeButton({
  messageId,
  commentId,
  blogSlug,
  currentSlug,
  likeCount,
  isLiked,
}) {
  // 2. 定义乐观状态
  // optimisticState 是当前显示的状态，addOptimistic 是用来更新它的函数
  const [optimisticState, addOptimistic] = useOptimistic(
    { likeCount, isLiked }, // 初始状态（来自服务器）
    (state, newLikeStatus) => {
      // 这是“乐观”的计算逻辑：
      // 如果本来是赞(true)，现在变成没赞(false)，数量就 -1
      // 如果本来没赞(false)，现在变成赞(true)，数量就 +1
      return {
        isLiked: !state.isLiked,
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      };
    }
  );

  return (
    <form
      action={async (formData) => {
        // A. 先立即更新 UI (不用等服务器)
        addOptimistic(!optimisticState.isLiked);
        
        // B. 然后再慢慢发请求给服务器
        toggleLike(formData);
      }}
    >
      <input type="hidden" name="messageId" value={messageId || ""} />
      <input type="hidden" name="commentId" value={commentId || ""} />
      <input type="hidden" name="postSlug" value={blogSlug || ""} />
      <input type="hidden" name="currentSlug" value={currentSlug || ""} />

      <button
        type="submit"
        className={`flex items-center gap-1.5 transition-colors duration-200 ${
          optimisticState.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
        }`}
      >
        <Heart
          size={18}
          // 使用乐观状态来控制实心/空心
          className={`${optimisticState.isLiked ? "fill-current" : ""}`}
        />
        {/* 使用乐观状态来显示数字 */}
        <span className="text-sm font-medium">
          {optimisticState.likeCount > 0 ? optimisticState.likeCount : "赞"}
        </span>
      </button>
    </form>
  );
}