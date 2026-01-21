// lib/getBingImage.js
export async function getBingImage() {
  try {
    const response = await fetch(
      "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",
      { next: { revalidate: 3600 } } // 每小时更新一次缓存
    );
    const data = await response.json();
    // 拼接成完整的图片地址
    return `https://www.bing.com${data.images[0].url}`;
  } catch (error) {
    console.error("Failed to fetch Bing image:", error);
    return null; // 失败时返回 null 或默认图地址
  }
}