const TextArea = (props) => {
  const hasValue = props.value && typeof props.value === 'string' && props.value.length > 0;

  return (
    props.readOnly ? (
      <textarea
          className="w-full px-4 py-3 text-base sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl outline-none resize-none font-mono leading-relaxed placeholder:text-gray-400"
        value={props.value}
        rows={props.rows}
        id={props.id}
        onChange={props.onChange}
        placeholder={props.placeholder}
        readOnly
      />
    ) : (
      <div className='relative'>
        <textarea
          className="w-full px-4 pr-16 py-3 text-base sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl outline-none appearance-none focus:ring-2 focus:ring-indigo-400/40 focus:ring-offset-0 focus:border-gray-200 dark:focus:border-gray-700/50 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600 themed-scrollbar"
          value={props.value}
          rows={props.rows}
          id={props.id}
          onChange={props.onChange}
          placeholder={props.placeholder}
        />
        {hasValue && (
          <button
            type='button'
            className='absolute top-2 right-3.5 text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded-lg transition-colors duration-150 cursor-pointer'
            onClick={props.onClear}
          >
            清空
          </button>
        )}
      </div>
    )
  );
};

export default TextArea;
