import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: '什么是 Cookie？',
    content: `Cookie 是网站放置在您设备上的小型文本文件。它们被广泛用于让网站更高效地运行，并向站点运营者提供信息。Cookie 与浏览器 localStorage 不同，后者也将在下文说明。`,
  },
  {
    title: 'Picksy 使用 Cookie 吗？',
    content: `Picksy 本身不会设置任何第一方 Cookie。该应用不会将 Cookie 用于身份验证、追踪、广告或任何其他目的。`,
  },
  {
    title: 'localStorage（并非 Cookie）',
    content: `Picksy 使用您浏览器的 localStorage（而非 Cookie）来在多次访问之间保存您的设置。以下内容会保存在您的设备本地：\n\n• 参与者列表（您输入的名字）\n• 中奖提示语\n• 「抽中后移除」开关状态\n• 浅色 / 深色模式偏好\n\nlocalStorage 数据仅存储在您的设备上，绝不会传输到任何服务器。您随时可以通过清除浏览器中本页面的站点数据来删除它。`,
  },
  {
    title: '第三方 Cookie —— Vercel Analytics',
    content: `Picksy 部署在 Vercel 上，并使用 Vercel Analytics 来了解总体使用情况。Vercel Analytics 以隐私友好为设计目标，不依赖 Cookie 来追踪用户。它收集匿名、聚合的数据，例如页面浏览量和大致的地理区域。\n\n这些数据仅由开发者访问，仅用于改进站点功能和用户体验。数据绝不会与第三方共享、出售，也不会用于营销或广告目的。有关 Vercel 如何处理数据的完整详情，请参阅 vercel.com/legal/privacy-policy 上的 Vercel 隐私政策。`,
  },
  {
    title: '不含广告或用户画像 Cookie',
    content: `Picksy 不使用广告网络、再营销服务或任何会构建个人用户画像的工具。除 Vercel Analytics 外，不会加载任何第三方脚本。`,
  },
  {
    title: '管理 Cookie 和站点数据',
    content: `您可以通过浏览器设置来控制和删除 Cookie 与 localStorage 数据。各浏览器的步骤有所不同：\n\n• Chrome：设置 → 隐私与安全 → 清除浏览数据\n• Firefox：设置 → 隐私与安全 → Cookie 和站点数据 → 清除数据\n• Safari：设置 → 隐私 → 管理网站数据\n\n请注意，清除 Picksy 的站点数据会一并删除您保存的名字列表和偏好设置。`,
  },
  {
    title: '本政策的变更',
    content: `本 Cookie 政策可能会不时更新。页面顶部的生效日期将反映最新修订。在变更发布后继续使用 Picksy，即表示您接受更新后的政策。`,
  },
  {
    title: '联系我们',
    content: `如果您对 Picksy 中的 Cookie 或数据存储有任何疑问，请通过 sudojoie@proton.me 联系开发者。`,
  },
];

const Cookies = () => {
  return (
    <div className='w-full max-w-2xl py-12 px-6'>
      <div className='mb-10'>
        <p className='text-xs uppercase tracking-widest font-semibold text-indigo-500 dark:text-indigo-400 mb-2'>法律</p>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>Cookie 政策</h1>
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          Picksy 如何处理 Cookie 和本地浏览器存储。
        </p>
        <p className='mt-1 text-xs text-gray-400 dark:text-gray-600'>生效日期：2026 年 4 月 21 日</p>
      </div>

      <div className='flex flex-col gap-6'>
        {sections.map((section, i) => (
          <div key={i} className='card p-5'>
            <h2 className='text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
              <span className='flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-[10px] font-bold'>
                {i + 1}
              </span>
              {section.title}
            </h2>
            <p className='mt-2 ml-7 text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line'>
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className='mt-10 flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-600'>
        <Link to='/privacy' className='hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors'>隐私政策</Link>
        <span>&middot;</span>
        <Link to='/terms' className='hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors'>服务条款</Link>
      </div>
    </div>
  );
};

export default Cookies;
