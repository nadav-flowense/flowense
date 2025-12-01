'use client';

import { type ComponentProps, type FormEvent, type JSX, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Heading';
import { GoogleIcon } from '../../atoms/Icon/GoogleIcon';
import { Input, PasswordInput } from '../../atoms/Input';
import { Text } from '../../atoms/Text';

const LastUsedIndicator = () => (
  <span className="ml-auto absolute top-0 right-0 px-2 py-1 text-xs bg-info/20 text-info rounded-md font-medium">
    Last Used
  </span>
);

export interface AuthError {
  type: 'user_not_found' | 'invalid_credentials' | 'generic';
  message: string;
}

export interface LoginFormProps
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onSubmit?: (data: LoginFormData) => void;
  onGoogleLogin?: () => void;
  onPasskeyLogin?: () => void;
  lastUsedLoginMethod?: string;
  onForgotPasswordClick?: () => void;
  onWaitlistClick?: () => void;
  onContactClick?: () => void;
  isLoading?: boolean;
  error?: AuthError | null;
  brandName?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm({
  className,
  onSubmit,
  onGoogleLogin,
  onForgotPasswordClick,
  onPasskeyLogin,
  lastUsedLoginMethod,
  onWaitlistClick,
  onContactClick,
  isLoading = false,
  error = null,
  brandName = 'Flowense',
  ...props
}: LoginFormProps): JSX.Element {
  const [rememberMe, _setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const emailEntry = formData.get('email');
    const passwordEntry = formData.get('password');

    const data: LoginFormData = {
      email: typeof emailEntry === 'string' ? emailEntry : '',
      password: typeof passwordEntry === 'string' ? passwordEntry : '',
      rememberMe,
    };

    onSubmit?.(data);
  };

  return (
    <form
      className={cn(
        'flex flex-col items-center w-full max-w-[400px] mx-auto',
        className,
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <Heading>Log in to {brandName}</Heading>

      <Button
        type="button"
        variant="social"
        size="social"
        icon={<GoogleIcon />}
        onClick={onGoogleLogin}
        disabled={isLoading}
        className="w-full h-16 mb-6"
      >
        Log in with Google
        {lastUsedLoginMethod === 'google' && <LastUsedIndicator />}
      </Button>

      <div className="flex items-center gap-6 w-full mb-4">
        <div className="flex-1 h-0.5 bg-border" />
        <Text className="text-lg text-muted-foreground inline">OR</Text>
        <div className="flex-1 h-0.5 bg-border" />
      </div>
      <div className="flex flex-col w-full gap-6 justify-center items-center">
        <Text className="font-medium text-base text-muted-foreground tracking-[0.08px]">
          Log in with password
        </Text>

        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          disabled={isLoading}
          size="lg"
        />

        <PasswordInput
          name="password"
          placeholder="Password"
          required
          disabled={isLoading}
          size="lg"
        />

        <Button
          type="submit"
          variant="default"
          className="w-full h-[61px] text-[15px] font-semibold mb-4"
          loading={isLoading}
        >
          Log In
        </Button>

        {error && (
          <div className="w-full p-4 mb-4 rounded-lg bg-destructive/10 border border-destructive/20">
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
      </div>
      {onForgotPasswordClick && (
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-primary hover:text-primary-hover underline transition-colors"
        >
          <Text>I forgot my password</Text>
        </button>
      )}
    </form>
  );
}

LoginForm.displayName = 'LoginForm';
