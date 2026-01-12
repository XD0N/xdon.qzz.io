"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { createMessage } from "@/app/actions";
import TextareaAutosize from "react-textarea-autosize";
import { Send } from "lucide-react";
import { toast } from "sonner";

// 🚀 1. 增加 parentId 和 onFinished 两个 props
export default function MessageForm({ children, parentId = null, onFinished }) {
  const [text, setText] = useState("");
  const isEmpty = text === "";
  const t = useTranslation('messageform');

  return (
    <form
      action={async (formData) => {
        try {
          await createMessage(formData);
          setText("");
          toast.success(t.success);
          // 🚀 2. 如果存在 onFinished（说明是回复框），提交成功后关闭它
          if (onFinished) onFinished(); 
        } catch (error) {
          toast.error(error.message || t.error);
        }
      }}
    >
      {/* 🚀 3. 核心修复：添加隐藏的 input，把 parentId 传给后端 */}
      <input type="hidden" name="parentId" value={parentId || ""} />

      <div className="flex gap-2 rounded-md shadow-[0_0px_1.2px_rgb(140,140,140)] p-3 min-h-20 ">
        <div className="w-12 h-12 shrink-0">{children}</div>
        <MessageInput text={text} setText={setText} isEmpty={isEmpty} isReply={!!parentId} />
      </div>
    </form>
  );
}

function MessageInput({ text, setText, isEmpty, isReply }) {
  const { pending } = useFormStatus();
  const t = useTranslation('messageinput');

  return (
    <div className="flex flex-col flex-grow gap-4 justify-between">
      <TextareaAutosize
        disabled={pending}
        className="p-0 w-full text-sm bg-transparent border-none outline-none resize-none placeholder-muted-foreground text-muted-foreground disabled:opacity-50"
        // 🚀 根据是否是回复动态切换占位符
        placeholder={isReply ? "写下你的回复..." : t.placeholder}
        name="message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
        autoFocus={isReply} // 回复时自动聚焦
      />

      <div
        className={`${isEmpty ? "opacity-0" : "opacity-100"} transition-opacity duration-1000 text-xs text-muted-foreground flex items-center justify-between gap-2`}
      >
        <span>{text.length}/500 </span>
        <button
          disabled={pending || isEmpty}
          type="submit"
          className="flex items-center justify-center gap-1.5"
        >
          <Send size={15} />
          <span className="font-bold">{isReply ? "回复" : t.send}</span>
        </button>
      </div>
    </div>
  );
}