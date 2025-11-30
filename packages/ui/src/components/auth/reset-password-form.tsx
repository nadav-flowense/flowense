import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '#/components/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/field';
import { Input } from '#/components/input';

export type ResetPasswordFormData = {
  password: string;
};

export type ResetPasswordFormProps = {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  minPasswordLength?: number;
  submitLabel?: string;
};

export function ResetPasswordForm({
  onSubmit,
  minPasswordLength = 8,
  submitLabel = 'Reset password',
}: ResetPasswordFormProps) {
  const resetPasswordSchema = z.object({
    password: z.string().min(minPasswordLength, {
      message: `Password must be at least ${minPasswordLength} characters`,
    }),
  });

  const form = useForm({
    defaultValues: { password: '' },
    validators: {
      onChange: resetPasswordSchema,
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      id="reset-password-form"
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
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
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
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit}
              form="reset-password-form"
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
