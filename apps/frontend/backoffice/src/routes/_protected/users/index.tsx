import { Users } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/users/')({
  component: BackofficeUsersPage,
});

function BackofficeUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Backoffice Users</h1>
      </div>
      <p className="text-muted-foreground">
        Manage backoffice user access and permissions. This page will display a list of authorized backoffice users.
      </p>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Backoffice user list coming soon...
      </div>
    </div>
  );
}
