const TextField = (props) => {
  const hasValue = props.value && typeof props.value === 'string' && props.value.length > 0;

  return (
    <div>
      {props.label && (
        <label
          htmlFor={props.id}
          className='block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5'
        >
          {props.label}
        </label>
      )}
      <div className='relative'>
        <input
          id={props.id}
          className='w-full pl-4 pr-16 py-3.5 sm:py-2.5 text-base sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl outline-none appearance-none focus:ring-2 focus:ring-indigo-400/40 focus:ring-offset-0 focus:border-gray-200 dark:focus:border-gray-700/50 placeholder:text-gray-400 dark:placeholder:text-gray-600'
          onChange={(e) => props.onChange(e.target.value)}
          value={props.value}
          maxLength={60}
          placeholder={props.placeholder}
        />
        {hasValue && (
          <button
            type='button'
            className='absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded-lg transition-colors duration-150 cursor-pointer'
            onClick={props.onClear}
          >
            清空
          </button>
        )}
      </div>
    </div>
  );
};

export default TextField;
