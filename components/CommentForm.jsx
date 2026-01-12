"use client";

import { createComment } from "@/app/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "提交中..." : "发表评论"}
    </button>
  );
}

export default function CommentForm({ slug }) {
  return (
    <form action={createComment} className="flex flex-col gap-3 mt-4">
      <input type="hidden" name="postSlug" value={slug} />
      <textarea
        name="text"
        placeholder="写下你的想法..."
        className="w-full min-h-[100px] p-3 text-sm bg-transparent border rounded-md border-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}