import {Link} from "react-router-dom";

const FileUpload = (props) => {
  const handleUpload = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let allowedExtensions = /(\.csv|\.txt)$/i;
    if (file) {
      if (allowedExtensions.exec(file.name)) {
        let reader = new FileReader();
        reader.onload = (e) => {
          props.onUpload(e.target.result);
        };
        reader.readAsText(file);
      } else {
        alert("仅支持纯文本文件（.txt）和逗号分隔值文件（.csv）。");
      }
    }
  };

  return (
    <div>
      <label className='block'>
        <input
          className='
            w-full text-xs text-gray-500 dark:text-gray-400 cursor-pointer
            file:mr-3 file:py-1.5 file:px-3
            file:rounded-lg file:border-0
            file:text-xs file:font-medium
            file:bg-indigo-50 file:text-indigo-600
            dark:file:bg-indigo-900/20 dark:file:text-indigo-400
            file:hover:bg-indigo-100 dark:file:hover:bg-indigo-900/30
            file:cursor-pointer file:transition-colors file:duration-150
          '
          type='file'
          accept='.txt, .csv'
          id={props.id}
          name={props.name}
          onChange={(e) => handleUpload(e)}
        />
      </label>
      <p className='mt-1.5 text-xs text-gray-400 dark:text-gray-500'>
        .txt or .csv {' '}
        <Link to='/help' className='link'>了解更多</Link>
      </p>
    </div>
  );
};

export default FileUpload;
