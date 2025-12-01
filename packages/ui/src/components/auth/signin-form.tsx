import { useForm } from '@tanstack/react-form';
import type { ReactNode } from 'react';
import { z } from 'zod';
import { Button } from '../atoms/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../molecules/Field';
import { Input } from '../atoms/Input';

export type SigninFormData = {
  email: string;
  password: string;
};

export type SigninFormProps = {
  onSubmit: (data: SigninFormData) => Promise<void>;
  minPasswordLength?: number;
  forgotPasswordLink?: ReactNode;
  submitLabel?: string;
};

export function SigninForm({
  onSubmit,
  minPasswordLength = 8,
  forgotPasswordLink,
  submitLabel = 'Sign in',
}: SigninFormProps) {
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
        <form.Field
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
              form="signin-form"
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
