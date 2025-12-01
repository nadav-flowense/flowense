'use client';

import { useForm } from '@tanstack/react-form';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { Button } from '../../atoms/Button';
import { GoogleIcon } from '../../atoms/Icon/GoogleIcon';
import { Input, PasswordInput } from '../../atoms/Input';
import { Text } from '../../atoms/Text';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '../../molecules/Field';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../molecules/Tooltip';

export type CompleteSigninFormData = {
  email: string;
  password: string;
};

export type AuthError = {
  type: 'user_not_found' | 'invalid_credentials' | 'generic';
  message: string;
};

export type CompleteSigninFormProps = {
  /** Handler for form submission with email/password */
  onSubmit: (data: CompleteSigninFormData) => Promise<void>;
  /** Handler for Google sign-in button */
  onGoogleSignIn?: () => void;
  /** Minimum password length for validation */
  minPasswordLength?: number;
  /** Link component for forgot password */
  forgotPasswordLink?: ReactNode;
  /** Label for the submit button */
  submitLabel?: string;
  /** Whether Google sign-in is loading */
  isGoogleLoading?: boolean;
  /** Error message to display */
  error?: AuthError | null;
  /** Brand name (configurable) */
  brandName?: string;
  /** Show social login options */
  showSocialLogin?: boolean;
};

export function CompleteSigninForm({
  onSubmit,
  onGoogleSignIn,
  minPasswordLength = 8,
  forgotPasswordLink,
  submitLabel = 'Sign in',
  isGoogleLoading = false,
  error = null,
  brandName = 'the app',
  showSocialLogin = true,
}: CompleteSigninFormProps) {
  const signinSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(minPasswordLength, {
      message: `Password must be at least ${minPasswordLength} characters`,
    }),
  });

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: {
      onChange: signinSchema,
      onSubmit: signinSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      id="signin-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        {/* Social Login Section */}
        {showSocialLogin && onGoogleSignIn && (
          <>
            <div className="flex justify-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    loading={isGoogleLoading}
                    onClick={onGoogleSignIn}
                    size="icon"
                    variant="secondary"
                    type="button"
                  >
                    <GoogleIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sign in with Google</TooltipContent>
              </Tooltip>
            </div>
            <FieldSeparator>
              <Text className="text-muted-foreground">or continue with email</Text>
            </FieldSeparator>
          </>
        )}

        {/* Email Field */}
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="m@example.com"
                  type="email"
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/* Password Field */}
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  className="flex justify-between gap-2"
                  htmlFor={field.name}
                >
                  Password
                  {forgotPasswordLink}
                </FieldLabel>
                <PasswordInput
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="********"
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/* Error Display */}
        {error && (
          <div className="w-full p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            {error.type === 'user_not_found' ? (
              <div className="text-center">
                <Text className="text-destructive font-medium mb-2">
                  This email isn't registered to {brandName}
                </Text>
              </div>
            ) : (
              <Text className="text-destructive font-medium text-center">
                {error.message}
              </Text>
            )}
          </div>
        )}

        {/* Submit Button */}
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit}
              form="signin-form"
              loading={isSubmitting}
              type="submit"
              className="w-full"
            >
              {submitLabel}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}

CompleteSigninForm.displayName = 'CompleteSigninForm';
