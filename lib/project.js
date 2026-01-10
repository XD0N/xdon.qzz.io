import { client } from "./sanity";

export async function getProjects() {
  const query = `*[_type == 'project'] | order(_updatedAt desc) {
        title,
          _id,
          link,
          description,
          tags,
          "imageUrl": image.asset->url
    }`;

  //const projects = await client.fetch(query);
  const projects = await client.fetch(
    query, 
    {},
    {
      cache: 'no-store',       // 告诉 fetch：绝对不要缓存！
      next: { revalidate: 0 }  // 过期时间为 0 秒
    }
  );

  return projects;
}
