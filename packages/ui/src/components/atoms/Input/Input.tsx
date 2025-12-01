'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  type LucideIcon,
  Search,
} from 'lucide-react';
import { type ComponentProps, type JSX, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Info } from '../Info';
import { Label } from '../Label';
import { Text } from '../Text';

const inputVariants = cva(
  'w-full rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-card',
  {
    variants: {
      variant: {
        default: 'border-input focus-visible:ring-ring',
        filled: 'bg-secondary border-transparent focus-visible:ring-ring',
        flushed:
          'bg-transparent border-0 border-b border-border rounded-none focus-visible:border-primary focus-visible:ring-0',
      },
      size: {
        sm: 'h-9 px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-5 text-lg',
      },
      state: {
        default: '',
        error: 'border-destructive-foreground focus-visible:ring-destructive-foreground',
        success: 'border-success-foreground focus-visible:ring-success-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  },
);

export interface InputProps
  extends Omit<ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  containerClassName?: string;
}

export function Input({
  className,
  containerClassName,
  label,
  error,
  success,
  helper,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  variant,
  size,
  state,
  id,
  ref,
  ...props
}: InputProps): JSX.Element {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success);
  const inputState = hasError ? 'error' : hasSuccess ? 'success' : state;
  const inputId = id || props.name;

  return (
    <div className={cn('w-full max-w-md', containerClassName)}>
      {label && (
        <Label htmlFor={inputId} className="block mb-2">
          {label}
          {props.required && (
            <Text className="ml-1 inline text-destructive-foreground">*</Text>
          )}
        </Label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <LeftIcon className="h-4 w-4" />
          </div>
        )}

        <input
          id={inputId}
          className={cn(
            inputVariants({ variant, size, state: inputState }),
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            className,
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${inputId}-error`
              : success
                ? `${inputId}-success`
                : helper
                  ? `${inputId}-helper`
                  : undefined
          }
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <RightIcon className="h-4 w-4" />
          </div>
        )}
      </div>

      {(error || success || helper) && (
        <div className="mt-2 space-y-1">
          {error && (
            <Text
              id={`${inputId}-error`}
              className="flex items-center gap-1 text-destructive-foreground"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </Text>
          )}

          {success && !error && (
            <Text
              id={`${inputId}-success`}
              className="flex items-center gap-1 text-success-foreground"
            >
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </Text>
          )}

          {helper && !error && !success && (
            <Info id={`${inputId}-helper`}>{helper}</Info>
          )}
        </div>
      )}
    </div>
  );
}

Input.displayName = 'Input';

export interface SearchInputProps
  extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (value: string) => void;
}

export function SearchInput({
  onSearch,
  placeholder = 'Search...',
  ...props
}: SearchInputProps): JSX.Element {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.currentTarget.value);
    }
    props.onKeyDown?.(e);
  };

  return (
    <Input
      type="search"
      placeholder={placeholder}
      leftIcon={Search}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

SearchInput.displayName = 'SearchInput';

export interface PasswordInputProps
  extends Omit<InputProps, 'rightIcon' | 'type'> {}

export function PasswordInput({
  containerClassName,
  ...props
}: PasswordInputProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const ToggleIcon = showPassword ? Eye : EyeOff;

  return (
    <div className={cn('relative w-full max-w-md', containerClassName)}>
      <Input
        type={showPassword ? 'text' : 'password'}
        containerClassName="w-full"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        <ToggleIcon className="h-4 w-4" />
      </button>
      <style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
        }
      `}</style>
    </div>
  );
}

PasswordInput.displayName = 'PasswordInput';

export { inputVariants };
