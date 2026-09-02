import React from 'react';
import TextArea from "./Input/TextArea";
import FileUpload from './FileUpload';

const List = (props) => {
  return (
    <div className='flex flex-col gap-3'>
      <TextArea
        value={props.value}
        rows={'6'}
        id={'listInput'}
        onChange={(e) => props.onChange(e.target.value)}
        onClear={props.onClear}
        placeholder={'每行一个名字...'}
      />
      <FileUpload
        id={'namesListFile'}
        name={'namesListFile'}
        onUpload={(e) => props.onChange(e)}
      />
    </div>
  );
};

export default List;
