import { useForm } from '@tanstack/react-form';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { Button } from '../atoms/Button';
import { Checkbox } from '../molecules/Checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../molecules/Field';
import { Input } from '../atoms/Input';

export type ForgotPasswordFormData = {
  email: string;
  sendEmailOTP: boolean;
};

export type ForgotPasswordFormProps = {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  showOtpOption?: boolean;
  otpOptionLabel?: string;
  otpOptionDescription?: ReactNode;
  submitLabel?: string;
  submitOtpLabel?: string;
};

export function ForgotPasswordForm({
  onSubmit,
  showOtpOption = true,
  otpOptionLabel = 'Send email OTP',
  otpOptionDescription = 'We will send a one-time password to reset your password.',
  submitLabel = 'Send reset link',
  submitOtpLabel = 'Send email OTP',
}: ForgotPasswordFormProps) {
  const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    sendEmailOTP: z.boolean(),
  });

  const form = useForm({
    defaultValues: { email: '', sendEmailOTP: false },
    validators: {
      onSubmit: forgotPasswordSchema,
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      id="forgot-password-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        <form.Field
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
          name="email"
        />
        {showOtpOption && (
          <form.Field
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="horizontal">
                  <Checkbox
                    aria-invalid={isInvalid}
                    checked={field.state.value}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {otpOptionLabel}
                    </FieldLabel>
                    <FieldDescription>{otpOptionDescription}</FieldDescription>
                  </FieldContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
            name="sendEmailOTP"
          />
        )}
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
            formState.values.sendEmailOTP,
          ]}
        >
          {([canSubmit, isSubmitting, sendEmailOTP]) => (
            <Button
              disabled={!canSubmit}
              form="forgot-password-form"
              loading={isSubmitting}
              size="sm"
              type="submit"
            >
              {sendEmailOTP ? submitOtpLabel : submitLabel}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
