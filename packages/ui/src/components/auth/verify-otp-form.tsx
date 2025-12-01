import { useForm } from '@tanstack/react-form';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { Button } from '../atoms/Button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../molecules/Field';
import { Input } from '../atoms/Input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../molecules/InputOtp';

export type VerifyOtpFormData = {
  otp: string;
  password: string;
};

export type VerifyOtpFormProps = {
  onSubmit: (data: VerifyOtpFormData) => Promise<void>;
  showPasswordField?: boolean;
  minPasswordLength?: number;
  otpLength?: number;
  otpDescription?: ReactNode;
  submitLabel?: string;
  errorContent?: ReactNode;
};

export function VerifyOtpForm({
  onSubmit,
  showPasswordField = false,
  minPasswordLength = 8,
  otpLength = 6,
  otpDescription = 'Please enter the one-time password from your authenticator app.',
  submitLabel = 'Verify OTP',
  errorContent,
}: VerifyOtpFormProps) {
  const verifyOtpSchema = z.object({
    otp: z
      .string()
      .min(otpLength, { message: `OTP must be ${otpLength} digits` }),
    password: showPasswordField
      ? z.string().min(minPasswordLength, {
          message: `Password must be at least ${minPasswordLength} characters`,
        })
      : z.string(),
  });

  const form = useForm({
    defaultValues: { otp: '', password: '' },
    validators: {
      onChange: verifyOtpSchema,
      onSubmit: verifyOtpSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  if (errorContent) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-muted-foreground text-sm">{errorContent}</div>
      </div>
    );
  }

  return (
    <form
      id="verify-otp-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        {showPasswordField && (
          <form.Field
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="********"
                    type="password"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
            name="password"
          />
        )}
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>OTP</FieldLabel>
                <InputOTP
                  aria-invalid={isInvalid}
                  id={field.name}
                  maxLength={otpLength}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e)}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup>
                    {Array.from({ length: otpLength }, (_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-muted-foreground text-sm">
                  {otpDescription}
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="otp"
        />
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit}
              form="verify-otp-form"
              loading={isSubmitting}
              size="sm"
              type="submit"
            >
              {submitLabel}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
