import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: '条款的接受',
    content: `访问或使用 Picksy（以下简称「本服务」）即表示您同意受本服务条款的约束。如果您不同意，请勿使用本服务。`,
  },
  {
    title: '服务说明',
    content: `Picksy 是一款免费、开源、客户端运行的 Web 应用，可从用户提供的列表中随机抽取一个名字。本服务按「原样」提供，供个人和非商业用途使用。`,
  },
  {
    title: '许可与允许的用途',
    content: `Picksy 采用 PolyForm Noncommercial License 1.0.0 许可。这意味着：\n\n• 您可以将 Picksy 用于个人或开源项目，进行使用、学习与修改。\n• 您可以非商业性地分享和再分发本应用。\n• 您不得将 Picksy 用于商业目的。\n• 您不得以任何产生收入或金钱报酬的方式使用 Picksy。\n\n完整的许可文本可在 polyformproject.org/licenses/noncommercial/1.0.0 查看。`,
  },
  {
    title: '用户责任',
    content: `您对输入到 Picksy 中的内容（包括参与者列表中的任何名字或数据）负全部责任。您同意不将本服务用于任何非法目的，或任何可能伤害他人的方式。`,
  },
  {
    title: '知识产权',
    content: `Picksy 的名称、标识和原始源代码是 joiellantero 的知识产权。对开源仓库所做的贡献受项目许可协议约束。`,
  },
  {
    title: '不作保证',
    content: `本服务按「原样」和「可用」提供，不提供任何明示或暗示的保证，包括但不限于对特定用途适用性、准确性或可靠性的保证。作者不保证本服务始终可用或没有错误。`,
  },
  {
    title: '责任限制',
    content: `在适用法律允许的最大范围内，joiellantero 对因您使用或无法使用本服务而产生的任何间接、附带、特殊或后果性损害概不负责——包括但不限于数据丢失或利润损失。`,
  },
  {
    title: '第三方链接',
    content: `本服务可能包含指向外部网站的链接（例如 GitHub、Ko-fi、Vercel）。这些链接仅为方便起见提供。Picksy 对任何第三方网站的内容或做法没有控制权，也不承担任何责任。`,
  },
  {
    title: '服务的修改',
    content: `开发者保留随时修改、暂停或终止本服务的权利，恕不另行通知。本条款也可能定期更新。在变更发布后继续使用本服务，即表示您接受修订后的条款。`,
  },
  {
    title: '适用法律',
    content: `本条款受适用法律管辖并依其解释。因本条款或本服务的使用产生的任何争议，将由有管辖权的法院专属管辖。`,
  },
  {
    title: '联系我们',
    content: `有关本条款的问题，可发送至 sudojoie@proton.me 联系开发者。`,
  },
];

const Terms = () => {
  return (
    <div className='w-full max-w-2xl py-12 px-6'>
      <div className='mb-10'>
        <p className='text-xs uppercase tracking-widest font-semibold text-indigo-500 dark:text-indigo-400 mb-2'>法律</p>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>服务条款</h1>
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          使用 Picksy 前，请仔细阅读以下条款。
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
        <Link to='/cookies' className='hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors'>Cookie 政策</Link>
      </div>
    </div>
  );
};

export default Terms;
