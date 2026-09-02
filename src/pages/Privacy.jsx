import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: '概述',
    content: `Picksy 是一个完全在客户端运行的 Web 应用。我们非常重视您的隐私。本政策将说明您使用 Picksy 时会涉及哪些数据，以及这些数据如何被处理。`,
  },
  {
    title: '我们不收集的数据',
    content: `Picksy 不收集、存储或传输任何个人身份信息。这里没有用户账户，没有注册表单，也没有登录。您输入的名字绝不会发送到任何服务器。`,
  },
  {
    title: '存储在您浏览器中的数据',
    content: `为了提供跨会话的无缝体验，Picksy 仅将以下数据保存在您浏览器的 localStorage 中：\n\n• 您的参与者列表（您输入的名字）\n• 您的中奖提示语\n• 您的「抽中后移除」偏好\n• 您的浅色 / 深色模式偏好\n\n这些数据绝不会离开您的设备。您随时可以通过清除浏览器中本页面的站点数据来删除它们。`,
  },
  {
    title: '分析',
    content: `Picksy 使用 Vercel Analytics，这是由 Vercel Inc. 提供的注重隐私的分析服务。Vercel Analytics 收集匿名、聚合的使用数据，例如页面浏览量和大致的地理区域。它不使用 Cookie，不跨站点追踪个人，也不构建个人画像。\n\n这些数据仅由开发者访问，仅用于改进站点功能和用户体验。数据绝不会与第三方共享、出售，也不会用于营销或广告目的。如需更多信息，请参阅 vercel.com/legal/privacy-policy 上的 Vercel 隐私政策。`,
  },
  {
    title: '文件上传',
    content: `当您上传 .txt 或 .csv 文件来填充名字列表时，该文件会通过 Web File API 完全在浏览器内读取。文件内容绝不会上传到任何服务器。`,
  },
  {
    title: '第三方服务',
    content: `Picksy 中集成的唯一第三方服务是 Vercel Analytics（如上所述）。不会加载任何广告网络、社交媒体追踪器或其他第三方脚本。`,
  },
  {
    title: '儿童隐私',
    content: `Picksy 不会有意收集 13 岁以下儿童的任何信息。由于完全不收集任何个人数据，本服务可安全地用于教育环境。`,
  },
  {
    title: '本政策的变更',
    content: `本政策可能会不时更新，以反映应用的变更。本页面底部的生效日期将相应更新。在变更后继续使用 Picksy，即表示您接受更新后的政策。`,
  },
  {
    title: '联系我们',
    content: `如有与隐私相关的问题或疑虑，您可以通过 sudojoie@proton.me 联系开发者。`,
  },
];

const Privacy = () => {
  return (
    <div className='w-full max-w-2xl py-12 px-6'>
      <div className='mb-10'>
        <p className='text-xs uppercase tracking-widest font-semibold text-indigo-500 dark:text-indigo-400 mb-2'>法律</p>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>隐私政策</h1>
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          Picksy 尊重您的隐私。以下是您的数据的确切去向。
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
        <Link to='/terms' className='hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors'>服务条款</Link>
        <span>&middot;</span>
        <Link to='/cookies' className='hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors'>Cookie 政策</Link>
      </div>
    </div>
  );
};

export default Privacy;
