"use client"; // 👈 1. 必须加

import { useTranslation } from "@/hooks/useTranslation"; // 👈 2. 引入翻译钩子

export default function BasisInfo() {
  const t = useTranslation('basicInfo'); // 👈 3. 获取翻译

  return (
    <div className="w-full rounded-lg shadow-[0_0px_1.2px_rgb(140,140,140)] py-6 px-4">
      <h2 className="mb-6 ml-2 text-lg text-green-200 opacity-60">
        {/* 替换标题 */}
        {t.title}
      </h2>
      
      <ul className="flex flex-col gap-5 pl-6 text-sm list-disc ">
        {/* 第一行：称呼 */}
        <li>
          {t.intro}{" "}
          <span className="font-bold">Michael</span>,{" "}
          <span className="font-bold">Xdon</span> or{" "}
          <span className="font-bold">旭东</span>.
        </li>

        {/* 第二行：当前位置 */}
        <li>
          {t.locationLabel}{" "}
          <a
            className="font-bold hover:underline" // 我加了个 hover 效果，你可以去掉
            href="https://en.wikipedia.org/wiki/Changzhou"
            target="_blank"
          >
            {t.locationValue}
          </a>
          .
        </li>

        {/* 第三行：曾居地 */}
        <li>
          {t.livedLabel}{" "}
          <a
            className="font-bold"
            href="https://en.wikipedia.org/wiki/Yangzhou"
            target="_blank"
          >
            {t.cities?.yangzhou || "Yangzhou"}
          </a>
          ,{" "}
          <a
            className="font-bold"
            href="https://en.wikipedia.org/wiki/Nanjing"
            target="_blank"
          >
            {t.cities?.nanjing || "Nanjing"}
          </a>
          ,{" "}
          <a
            className="font-bold"
            href="https://en.wikipedia.org/wiki/Xiamen"
            target="_blank"
          >
            {t.cities?.xiamen || "Xiamen"}
          </a>{" "}
          <a
            className="font-bold"
            href="https://en.wikipedia.org/wiki/Shanghai"
            target="_blank"
          >
            {t.cities?.shanghai || "Shanghai"}
          </a>
          {t.livedSuffix}
        </li>
      </ul>
    </div>
  );
}