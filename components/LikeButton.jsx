"use client";
import { toggleLike } from "@/app/actions";
import { Heart } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton({ likeCount, isLiked }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className={`flex items-center gap-1 transition-colors ${
        isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
      }`}
    >
      <Heart size={16} className={isLiked ? "fill-current" : ""} />
      <span className="text-sm">{likeCount > 0 ? likeCount : "赞"}</span>
    </button>
  );
}

export default function LikeButton({ 
  messageId, // 如果是赞留言，传这个
  commentId, // 如果是赞评论，传这个
  postSlug,  // 如果是赞文章，传这个
  currentSlug, // 如果是赞评论，必须额外传当前文章slug用于刷新
  likeCount, 
  isLiked 
}) {
  return (
    <form action={toggleLike}>
      <input type="hidden" name="messageId" value={messageId || ""} />
      <input type="hidden" name="commentId" value={commentId || ""} />
      <input type="hidden" name="postSlug" value={postSlug || ""} />
      <input type="hidden" name="currentSlug" value={currentSlug || ""} />
      
      <SubmitButton likeCount={likeCount} isLiked={isLiked} />
    </form>
  );
}