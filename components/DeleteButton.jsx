"use client";

import { deleteMessage } from "@/app/actions"; // 引入刚才写的 action
import { Trash2 } from "lucide-react"; // 假设你装了 lucide-react 图标库
// 或者用文字 <button>删除</button>

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="text-red-500 hover:text-red-700 transition-colors opacity-60 hover:opacity-100"
      title="Delete Message"
    >
      {pending ? "..." : <Trash2 size={16} />} 
    </button>
  );
}

export default function DeleteButton({ id }) {
  return (
    <form action={deleteMessage}>
      <input type="hidden" name="messageId" value={id} />
      <SubmitButton />
    </form>
  );
}