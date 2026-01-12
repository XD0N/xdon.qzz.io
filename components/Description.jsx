"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function Description({ page }) {
  const tTitles = useTranslation('pageTitles');
  const tDescs = useTranslation('pageDescriptions');

  // 把传入的 page (如 "Message") 转成小写 key (如 "message")
  const key = page?.toLowerCase() || "";

  return (
    <motion.section 
      initial={{ y: 30, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className="w-full"
    >
      {/* 标题 */}
      <h1 className="text-4xl font-semibold ">
        {tTitles[key] || page}
      </h1>
      
      {/* 描述/副标题 */}
      <p className="font-light mt-2 text-muted-foreground">
        {tDescs[key] || ""}
      </p>
    </motion.section>
  );
}