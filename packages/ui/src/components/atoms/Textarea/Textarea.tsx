'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle } from 'lucide-react';
import type { ComponentProps, JSX } from 'react';
import * as React from 'react';

import { cn } from '../../../lib/utils';
import { Info } from '../Info';
import { Label } from '../Label';
import { Text } from '../Text';

const textareaVariants = cva(
  'w-full rounded-lg border border-border bg-card transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      resize: {
        none: 'resize-none',
        both: 'resize',
        horizontal: 'resize-x',
        vertical: 'resize-y',
      },
      size: {
        sm: 'px-3 py-2 text-sm min-h-16',
        md: 'px-4 py-2.5 text-base min-h-20',
        lg: 'px-6 py-3 text-lg min-h-24',
      },
      state: {
        default: '',
        error: 'border-destructive-foreground focus-visible:ring-destructive-foreground',
        success: 'border-success-foreground focus-visible:ring-success-foreground',
      },
    },
    defaultVariants: {
      resize: 'vertical',
      size: 'md',
      state: 'default',
    },
  },
);

export interface TextareaProps
  extends ComponentProps<'textarea'>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helper,
      resize,
      size,
      state,
      id,
      ...props
    },
    ref,
  ): JSX.Element => {
    const hasError = Boolean(error);
    const textareaState = hasError ? 'error' : state;
    const textareaId = id || props.name;

    return (
      <div className={cn('w-full max-w-md', containerClassName)}>
        {label && (
          <Label htmlFor={textareaId} className="block mb-2">
            {label}
            {props.required && (
              <Text className="ml-1 inline text-destructive-foreground">*</Text>
            )}
          </Label>
        )}

        <textarea
          id={textareaId}
          className={cn(
            textareaVariants({ resize, size, state: textareaState }),
            className,
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helper
                ? `${textareaId}-helper`
                : undefined
          }
          {...props}
        />

        {(error || helper) && (
          <div className="mt-2">
            {error && (
              <Text
                id={`${textareaId}-error`}
                className="flex items-center gap-1 text-destructive-foreground"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </Text>
            )}
            {helper && !error && (
              <Info id={`${textareaId}-helper`}>{helper}</Info>
            )}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
