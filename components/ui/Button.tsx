import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-pbs-red hover:bg-pbs-red-dark text-white shadow-sm hover:shadow-md active:bg-pbs-red-dark',
  secondary:
    'bg-pbs-black hover:bg-pbs-gray-800 text-white shadow-sm hover:shadow-md active:bg-pbs-gray-900',
  outline:
    'border-2 border-pbs-red text-pbs-red hover:bg-pbs-red hover:text-white dark:border-pbs-red-light dark:text-pbs-red-light dark:hover:bg-pbs-red dark:hover:text-white',
  ghost:
    'text-pbs-gray-700 hover:bg-pbs-gray-100 dark:text-pbs-gray-300 dark:hover:bg-pbs-gray-800',
  gold:
    'bg-pbs-gold hover:bg-pbs-gold-dark text-pbs-black font-semibold shadow-sm hover:shadow-md active:bg-pbs-gold-dark',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pbs-red disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
