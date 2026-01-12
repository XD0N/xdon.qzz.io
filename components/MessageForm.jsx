"use client";
import { useLanguageStore } from "@/lib/store";
import { dictionary } from "@/lib/dictionary";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { createMessage } from "@/app/actions";
import TextareaAutosize from "react-textarea-autosize";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function MessageForm({ children, parentId = null, onFinished, autoFocus = false }) {
  const [text, setText] = useState("");
  const { lang } = useLanguageStore();
  
  const tForm = dictionary[lang]?.messageform || dictionary.en.messageform;
  const tInput = dictionary[lang]?.messageinput || dictionary.en.messageinput;

  return (
    <form
      action={async (formData) => {
        try {
          await createMessage(formData);
          setText("");
          toast.success(tForm.success);
          if (onFinished) onFinished(); 
        } catch (error) {
          toast.error(error.message || tForm.error);
        }
      }}
      className="w-full"
    >
      <input type="hidden" name="parentId" value={parentId || ""} />
      <div className={`flex gap-3 p-2 rounded-lg transition-all ${parentId ? "bg-transparent" : "bg-card/50 border border-muted/60 shadow-sm"}`}>
        <div className="shrink-0 pt-1">{children}</div>
        <div className="flex flex-col flex-grow gap-2">
          <TextareaAutosize
            className="w-full py-2 text-sm bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/60 text-foreground"
            // 🚀 修复：回复时显示回复占位符
            placeholder={parentId ? (tInput.replyPlaceholder || "Reply...") : tInput.placeholder}
            name="message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            autoFocus={autoFocus}
          />
          <div className="flex items-center justify-between border-t border-muted/30 pt-2 mt-1">
            <span className={`text-[10px] transition-opacity ${text.length === 0 ? "opacity-0" : "opacity-50"}`}>
              {text.length} / 500
            </span>
            <SubmitButton t={tInput} isReply={!!parentId} isEmpty={text.trim() === ""} />
          </div>
        </div>
      </div>
    </form>
  );
}

function SubmitButton({ t, isReply, isEmpty }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending || isEmpty}
      type="submit"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
      {/* 🚀 修复：回复时显示“回复”，否则显示“发送” */}
      {isReply ? (t.reply || "Reply") : t.send}
    </button>
  );
}