import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '../atoms/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../molecules/Field';
import { Input } from '../atoms/Input';

export type EmailOtpFormData = {
  email: string;
};

export type EmailOtpFormProps = {
  onSubmit: (data: EmailOtpFormData) => Promise<void>;
  submitLabel?: string;
};

export function EmailOtpForm({
  onSubmit,
  submitLabel = 'Send OTP',
}: EmailOtpFormProps) {
  const emailOtpSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  });

  const form = useForm({
    defaultValues: { email: '' },
    validators: {
      onChange: emailOtpSchema,
      onSubmit: emailOtpSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      id="email-otp-form"
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
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit}
              form="email-otp-form"
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
