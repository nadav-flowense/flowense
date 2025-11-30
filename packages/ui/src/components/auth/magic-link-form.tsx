import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '#/components/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/field';
import { Input } from '#/components/input';

export type MagicLinkFormData = {
  email: string;
};

export type MagicLinkFormProps = {
  onSubmit: (data: MagicLinkFormData) => Promise<void>;
  submitLabel?: string;
};

export function MagicLinkForm({
  onSubmit,
  submitLabel = 'Send Magic Link',
}: MagicLinkFormProps) {
  const magicLinkSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  });

  const form = useForm({
    defaultValues: { email: '' },
    validators: {
      onChange: magicLinkSchema,
      onSubmit: magicLinkSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      id="magic-link-form"
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
              form="magic-link-form"
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
