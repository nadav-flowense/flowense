'use client';

import type { FormEvent, JSX } from 'react';
import { useState } from 'react';

import { cn } from '../../../lib/utils';
import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Heading';
import { ProviderIcon } from '../../atoms/Icon';
import { Input, PasswordInput } from '../../atoms/Input';
import { Text } from '../../atoms/Text';

import type {
  AuthFormEmailData,
  AuthFormProps,
  AuthFormProvider,
} from './AuthForm.types';

export function AuthForm({
  className,
  providers,
  onProviderSelect,
  showEmailAuth = true,
  onEmailSubmit,
  showForgotPassword = true,
  onForgotPasswordClick,
  showWaitlistLink = true,
  onWaitlistClick,
  showContactLink = true,
  onContactClick,
  isLoading = false,
  error = null,
  title = 'Log in to Flowense',
  subtitle,
  brandName = 'Flowense',
  ...props
}: AuthFormProps & { brandName?: string }): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const data: AuthFormEmailData = { email, password };
    onEmailSubmit?.(data);
  };

  const handleProviderClick = (provider: AuthFormProvider): void => {
    onProviderSelect(provider);
  };

  const hasProviders = providers.length > 0;
  const showDivider = hasProviders && showEmailAuth;

  return (
    <div
      className={cn(
        'flex flex-col items-center w-full max-w-[400px] mx-auto',
        className,
      )}
      data-testid="auth-form"
      {...props}
    >
      {/* Header */}
      <Heading>{title}</Heading>

      {subtitle && (
        <Text className="text-muted-foreground mb-6 text-center">{subtitle}</Text>
      )}

      {/* OAuth Providers */}
      {hasProviders && (
        <div
          className="flex flex-col gap-3 w-full mb-6"
          data-testid="auth-providers"
        >
          {providers.map((provider) => (
            <Button
              key={provider.id}
              type="button"
              variant="social"
              size="social"
              icon={
                provider.icon ? (
                  <ProviderIcon provider={provider.icon} size={20} />
                ) : undefined
              }
              onClick={() => handleProviderClick(provider)}
              disabled={isLoading}
              className="w-full h-16"
              data-testid={`auth-provider-${provider.id}`}
            >
              Continue with {provider.name}
            </Button>
          ))}
        </div>
      )}

      {/* Divider */}
      {showDivider && (
        <div className="flex items-center gap-6 w-full mb-4">
          <div className="flex-1 h-0.5 bg-border" />
          <Text className="text-lg text-muted-foreground inline">OR</Text>
          <div className="flex-1 h-0.5 bg-border" />
        </div>
      )}

      {/* Email/Password Form */}
      {showEmailAuth && (
        <form
          onSubmit={handleEmailSubmit}
          className="flex flex-col w-full gap-6 justify-center items-center"
          data-testid="email-auth-form"
        >
          {hasProviders && (
            <Text className="font-medium text-base text-muted-foreground tracking-[0.08px]">
              Log in with password
            </Text>
          )}

          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            disabled={isLoading}
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            name="password"
            placeholder="Password"
            required
            disabled={isLoading}
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="default"
            className="w-full h-[61px] text-[15px] font-semibold mb-4"
            loading={isLoading}
          >
            Log In
          </Button>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="w-full p-4 mb-4 rounded-lg bg-destructive/10 border border-destructive/20"
          role="alert"
          data-testid="auth-error"
        >
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

      {/* Forgot Password Link */}
      {showEmailAuth && showForgotPassword && (
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="font-medium text-base text-muted-foreground tracking-[0.08px] underline decoration-solid underline-offset-2 mb-8 bg-transparent border-none cursor-pointer hover:text-foreground transition-colors"
        >
          <Text>I forgot my password</Text>
        </button>
      )}
    </div>
  );
}

AuthForm.displayName = 'AuthForm';
