import React from 'react';

const features = [
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
      </svg>
    ),
    title: '随机抽取名字',
    description: '只需一次点击，即可从列表中随机抽取一个名字。公平、无偏见、即时完成。',
  },
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0v10m0 0l-3-3m3 3l3-3' />
      </svg>
    ),
    title: '旋转转盘',
    description: '切换到动画转盘，以更直观、更刺激的方式选出获胜者。',
  },
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
      </svg>
    ),
    title: '抽中后移除',
    description: '可选择在名字被抽中后将其从池中移除，避免同一人被抽中两次。',
  },
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
      </svg>
    ),
    title: '全屏模式',
    description: '进入全屏进行无干扰的抽取，可放大缩小以获得最佳视图。',
  },
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
      </svg>
    ),
    title: '文件上传',
    description: '上传 .txt 或 .csv 文件，即刻填充名字列表，无需手动输入。',
  },
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
      </svg>
    ),
    title: '自定义中奖提示',
    description: '自定义抽取名字时显示的消息，可随时开启或关闭。',
  },
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M5 3l3.057 7.134L3 16h6l3 5 3-5h6l-5.057-5.866L19 3l-5.5 4L10.5 3 8 7 5 3z' />
      </svg>
    ),
    title: '彩带特效开关',
    description: '用绚丽的彩带庆祝每一位获胜者，或关闭以获得更安静的体验。',
  },
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
      </svg>
    ),
    title: '深色模式',
    description: '在浅色与深色主题之间切换。您的偏好会自动跨会话保存。',
  },
  {
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.75} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
      </svg>
    ),
    title: '隐私优先',
    description: '您的名字列表仅保存在本地浏览器中。任何内容都不会发送到服务器。',
  },
];

const Features = () => {
  return (
    <div className='w-full max-w-2xl py-12 px-6'>
      <div className='mb-10'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>功能特性</h1>
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          进行公平、有趣抽取所需的一切。
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {features.map((f, i) => (
          <div key={i} className='card p-5 flex gap-4'>
            <div className='flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400'>
              {f.icon}
            </div>
            <div>
              <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>{f.title}</h3>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>{f.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className='mt-8 text-xs text-gray-400 dark:text-gray-600'>
        有功能建议？{' '}
        <a href='https://github.com/joiellantero/picksy/issues' className='link' target="_blank" rel="noopener noreferrer">告诉我们</a>。
      </p>
    </div>
  );
};

export default Features;
