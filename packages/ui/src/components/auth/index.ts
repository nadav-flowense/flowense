// Auth wrapper
export { AuthWrapper } from './auth-wrapper';
export type { AuthWrapperProps } from './auth-wrapper';

// Forms
export { SigninForm } from './signin-form';
export type { SigninFormData, SigninFormProps } from './signin-form';

export { SignupForm } from './signup-form';
export type { SignupFormData, SignupFormProps } from './signup-form';

export { MagicLinkForm } from './magic-link-form';
export type { MagicLinkFormData, MagicLinkFormProps } from './magic-link-form';

export { EmailOtpForm } from './email-otp-form';
export type { EmailOtpFormData, EmailOtpFormProps } from './email-otp-form';

export { ForgotPasswordForm } from './forgot-password-form';
export type {
  ForgotPasswordFormData,
  ForgotPasswordFormProps,
} from './forgot-password-form';

export { ResetPasswordForm } from './reset-password-form';
export type {
  ResetPasswordFormData,
  ResetPasswordFormProps,
} from './reset-password-form';

export { VerifyOtpForm } from './verify-otp-form';
export type { VerifyOtpFormData, VerifyOtpFormProps } from './verify-otp-form';

export { Verify2FaForm } from './verify-2fa-form';
export type { Verify2FaFormData, Verify2FaFormProps } from './verify-2fa-form';

// Social auth buttons
export { GoogleSignInButton } from './google';
export type { GoogleSignInButtonProps } from './google';

export { GithubSignInButton } from './github';
export type { GithubSignInButtonProps } from './github';

export { PasskeySignInButton } from './passkey';
export type { PasskeySignInButtonProps } from './passkey';
