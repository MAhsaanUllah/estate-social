import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  className = '',
  error = false,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full h-11 px-4 bg-white dark:bg-zinc-900 border rounded-xl text-sm text-gray-900 dark:text-zinc-50 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-zinc-100/10 focus:border-gray-900 dark:focus:border-zinc-100 transition-all duration-200',
        error ? 'border-red-500 text-red-900 dark:text-red-300 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 dark:border-zinc-800',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
