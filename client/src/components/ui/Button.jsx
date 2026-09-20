import React from 'react';
import { cn } from '../../utils/cn';

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

  const variants = {
    primary: 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-black dark:hover:bg-white active:scale-[0.98]',
    secondary: 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-[0.98]',
    ghost: 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg',
  };

  const sizes = {
    default: 'h-10 px-5 text-sm',
    lg: 'h-11 px-5 text-base',
    sm: 'h-9 px-4 text-xs',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.default, className)}
      {...props}
    >
      {children}
    </button>
  );
}
