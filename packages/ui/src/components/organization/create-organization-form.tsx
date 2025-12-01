import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '#/components/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/field';
import { Input } from '#/components/input';

export type CreateOrganizationFormData = {
  name: string;
  slug: string;
};

export type CreateOrganizationFormProps = {
  onSubmit: (data: CreateOrganizationFormData) => Promise<void>;
  submitLabel?: string;
};

export function CreateOrganizationForm({
  onSubmit,
  submitLabel = 'Create Organization',
}: CreateOrganizationFormProps) {
  const schema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    slug: z
      .string()
      .min(2, { message: 'Slug must be at least 2 characters' })
      .regex(/^[a-z0-9-]+$/, {
        message: 'Slug must be lowercase letters, numbers, and dashes only',
      }),
  });

  const form = useForm({
    defaultValues: { name: '', slug: '' },
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      id="create-organization-form"
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
                <FieldLabel htmlFor={field.name}>Organization Name</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    // Auto-generate slug from name
                    const slugField = form.getFieldValue('slug');
                    if (
                      !slugField ||
                      slugField === generateSlug(field.state.value)
                    ) {
                      form.setFieldValue('slug', generateSlug(e.target.value));
                    }
                  }}
                  placeholder="My Company"
                  type="text"
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="name"
        />
        <form.Field
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="my-company"
                  type="text"
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
          name="slug"
        />
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              className="w-full"
              disabled={!canSubmit}
              form="create-organization-form"
              loading={isSubmitting}
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
