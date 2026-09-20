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
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]',
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]',
    dark: 'bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]',
    black: 'bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]',
    secondary: 'bg-white border border-gray-200 hover:border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 active:scale-[0.98]',
    outline: 'bg-white border border-gray-200 hover:border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 active:scale-[0.98]',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors',
    danger: 'bg-red-600 hover:bg-red-700 text-white rounded-xl active:scale-[0.98]',
  };

  const sizes = {
    default: 'h-10 px-5 text-sm font-semibold',
    lg: 'h-12 px-6 text-base font-bold',
    sm: 'h-9 px-4 text-xs font-semibold',
    xs: 'h-8 px-3 text-xs font-medium',
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
