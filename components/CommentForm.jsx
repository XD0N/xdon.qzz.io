"use client";

import { createComment } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { useLanguageStore } from "@/lib/store";
import { dictionary } from "@/lib/dictionary";
import { Loader2, Send } from "lucide-react";

function SubmitButton({ label, loadingLabel }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:grayscale"
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
      <span>{pending ? loadingLabel : label}</span>
    </button>
  );
}

export default function CommentForm({ 
  slug, 
  parentId, 
  onFinished, 
  placeholder, 
  initialValue = "", 
  autoFocus = false 
}) {
  const [text, setText] = useState(initialValue);
  const { lang } = useLanguageStore();
  
  // 🚀 核心修复：只使用 comment 字典
  const t = dictionary[lang]?.comment || dictionary.en.comment;

  return (
    <form 
      action={async (formData) => {
        await createComment(formData);
        if (onFinished) onFinished();
        setText(""); 
      }} 
      className="flex flex-col gap-3"
    >
      <input type="hidden" name="postSlug" value={slug} />
      <input type="hidden" name="parentId" value={parentId || ""} />
      
      <textarea
        name="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        // 🚀 使用 comment 字典中的占位符
        placeholder={placeholder || (parentId ? t.replyPlaceholder : t.placeholder)}
        className="w-full min-h-[100px] p-3 text-sm bg-transparent border rounded-lg border-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        required
        autoFocus={autoFocus}
      />
      <div className="flex justify-end">
        <SubmitButton 
          // 🚀 使用 comment 字典中的按钮文字
          label={parentId ? t.replyBtn : t.postBtn} 
          loadingLabel={t.loading}
        />
      </div>
    </form>
  );
}