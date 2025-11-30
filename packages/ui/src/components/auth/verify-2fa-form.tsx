import { useForm } from '@tanstack/react-form';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { Button } from '#/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '#/components/input-otp';

export type Verify2FaFormData = {
  otp: string;
};

export type Verify2FaFormProps = {
  onSubmit: (data: Verify2FaFormData) => Promise<void>;
  otpLength?: number;
  otpDescription?: ReactNode;
  submitLabel?: string;
};

export function Verify2FaForm({
  onSubmit,
  otpLength = 6,
  otpDescription = 'Please enter the one-time password from your authenticator app.',
  submitLabel = 'Verify 2FA Code',
}: Verify2FaFormProps) {
  const verify2FaSchema = z.object({
    otp: z
      .string()
      .min(otpLength, { message: `OTP must be ${otpLength} digits` }),
  });

  const form = useForm({
    defaultValues: { otp: '' },
    validators: {
      onChange: verify2FaSchema,
      onSubmit: verify2FaSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      id="verify-2fa-form"
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
              form="verify-2fa-form"
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
