"use client";

import { createComment } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { useState } from "react";

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "提交..." : label}
    </button>
  );
}

export default function CommentForm({ 
  slug, 
  parentId, 
  onFinished, 
  placeholder, 
  initialValue = "", 
  autoFocus = false // 👈 进阶建议：默认不聚焦
}) {
  const [text, setText] = useState(initialValue);

  return (
    <form 
      action={async (formData) => {
        await createComment(formData);
        if (onFinished) onFinished();
        setText(""); 
      }} 
      className="flex flex-col gap-3 mt-4"
    >
      <input type="hidden" name="postSlug" value={slug} />
      <input type="hidden" name="parentId" value={parentId || ""} />
      
      <textarea
        name="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || "写下你的想法..."}
        className="w-full min-h-[80px] p-3 text-sm bg-transparent border rounded-md border-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        autoFocus={autoFocus} // 👈 根据传入属性决定是否聚焦
      />
      <div className="flex justify-end">
        <SubmitButton label={parentId ? "回复" : "发表评论"} />
      </div>
    </form>
  );
}