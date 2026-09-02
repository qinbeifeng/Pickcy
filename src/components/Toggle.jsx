import { Field, Label, Switch } from '@headlessui/react';

export default function Toggle(props) {
  return (
    <Field>
      <div className={`flex items-center justify-between ${props.hiddenMobile ? 'md:hidden' : 'flex'}`}>
        <Label passive className='text-base sm:text-sm text-gray-600 dark:text-gray-400 select-none cursor-pointer'>
          {props.label}
        </Label>
        <Switch
          checked={props.isOn}
          onChange={props.handleToggle}
          className={`${
            props.isOn ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
          } relative inline-flex flex-shrink-0 h-8 w-14 sm:h-6 sm:w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/75`}
        >
          <span className='sr-only'>使用设置</span>
          <span
            aria-hidden='true'
            className={`${
              props.isOn ? 'translate-x-7 sm:translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-7 w-7 sm:h-5 sm:w-5 rounded-full bg-white shadow-md transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
      </div>
    </Field>
  );
}
