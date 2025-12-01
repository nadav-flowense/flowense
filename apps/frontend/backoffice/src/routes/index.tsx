import { createFileRoute } from '@tanstack/react-router';
import { Building2 } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: AccountsPage,
});

function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Accounts</h1>
      </div>
      <p className="text-muted-foreground">
        Manage all organization accounts. This page will display a list of all
        organizations.
      </p>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Organization list coming soon...
      </div>
    </div>
  );
}
