'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'outline';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button3D({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className,
  disabled,
  ...props 
}: Button3DProps) {
  
  // Mapeig de variants a les nostres classes globals
  const variantClasses = {
    primary: 'btn-primary',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'btn-outline',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        variantClasses[variant], // Aplica la classe base del globals.css
        "flex items-center justify-center gap-2", // Centrat extra
        (disabled || isLoading) && "opacity-70 cursor-not-allowed transform-none active:translate-y-0 active:border-b-4", // Estat desactivat
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}