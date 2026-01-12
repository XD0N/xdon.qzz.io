import prisma from "@/lib/db";
import MessageItem from "./MessageItem";

// 🧠 核心修复：更严谨的两层平铺算法
function organizeMessages(allMessages) {
  const messageMap = new Map();
  const roots = [];

  // 1. 第一遍遍历：初始化所有消息的属性
  allMessages.forEach((m) => {
    m.flatReplies = []; 
    m.replyToUser = null; 
    messageMap.set(m.id, m);
  });

  // 2. 第二遍遍历：构建父子关系
  allMessages.forEach((m) => {
    if (m.parentId) {
      // 如果有 parentId，说明它是回复
      const parent = messageMap.get(m.parentId);
      if (parent) {
        m.replyToUser = parent.userName; // 记录被回复者的名字
        
        // 🚀 关键逻辑：寻找顶级祖先（Root）
        let root = parent;
        while (root.parentId) {
          const grandParent = messageMap.get(root.parentId);
          if (!grandParent) break;
          root = grandParent;
        }
        
        // 将此回复塞入顶级祖先的扁平回复池
        root.flatReplies.push(m);
      } else {
        // 如果 parentId 指向的消息不存在，退化为顶级消息（防止数据孤儿消失）
        roots.push(m);
      }
    } else {
      // 没有 parentId，本身就是顶级消息
      roots.push(m);
    }
  });

  // 3. 排序：顶级留言倒序（最新在前），子回复正序（时间流向）
  roots.forEach(root => {
    root.flatReplies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  });
  
  return roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export default async function Messages({ user, isAdmin }) {
  // 获取所有留言，注意务必包含 parentId 字段
  const rawData = await prisma.message.findMany({
    include: {
      likes: true, 
    },
    // 这里不需要在数据库层面排序太死，算法会重新排
  });

  // 序列化解决 Date 对象传递报错问题
  const safeData = JSON.parse(JSON.stringify(rawData));

  // 运行修复后的重组算法
  const organizedData = organizeMessages(safeData);

  return (
    <div className="flex flex-col space-y-8"> 
      {organizedData.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          user={user} 
          isAdmin={isAdmin} 
        />
      ))}
    </div>
  );
}