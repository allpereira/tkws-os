import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTenant } from '@/modules/plataforma/tenants/api';
import { createTenantSchema, type CreateTenantInput } from '@/modules/plataforma/tenants/schema';

interface Props {
  onSuccess?: (tenantId: number) => void;
}

export function CreateTenantForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTenantInput>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: { zitadelOrgId: '', name: '', slug: '' },
  });

  const createTenant = useCreateTenant();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const created = await createTenant.mutateAsync(data);
      reset();
      onSuccess?.(created.id);
    } catch {
      // Falha tratada na UI via `createTenant.isError`; não propaga a rejeição.
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label="Criar tenant">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Nome do escritório
        </label>
        <input
          id="name"
          {...register('name')}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="text-sm font-medium">
          Identificador (slug)
        </label>
        <input
          id="slug"
          {...register('slug')}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
          aria-invalid={!!errors.slug}
          aria-describedby={errors.slug ? 'slug-error' : undefined}
        />
        {errors.slug && (
          <p id="slug-error" role="alert" className="mt-1 text-sm text-destructive">
            {errors.slug.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="zitadelOrgId" className="text-sm font-medium">
          Zitadel Org ID
        </label>
        <input
          id="zitadelOrgId"
          {...register('zitadelOrgId')}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
          aria-invalid={!!errors.zitadelOrgId}
        />
        {errors.zitadelOrgId && (
          <p role="alert" className="mt-1 text-sm text-destructive">
            {errors.zitadelOrgId.message}
          </p>
        )}
      </div>

      {createTenant.isError && (
        <p role="alert" className="text-sm text-destructive">
          Erro ao criar tenant. Tente novamente.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || createTenant.isPending}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        {isSubmitting || createTenant.isPending ? 'Criando...' : 'Criar tenant'}
      </button>
    </form>
  );
}
