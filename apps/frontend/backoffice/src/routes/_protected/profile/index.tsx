import { User } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';
import { authClient } from '@/clients/authClient';

export const Route = createFileRoute('/_protected/profile/')({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: session } = authClient.useSession();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <p className="text-muted-foreground">
        Manage your profile settings and preferences.
      </p>
      {session?.user && (
        <div className="rounded-lg border p-6 space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Name</span>
            <p className="font-medium">{session.user.name}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Email</span>
            <p className="font-medium">{session.user.email}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Role</span>
            <p className="font-medium capitalize">{session.user.role}</p>
          </div>
        </div>
      )}
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Profile editing coming soon...
      </div>
    </div>
  );
}
