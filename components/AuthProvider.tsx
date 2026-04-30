'use client';

// Re-export Clerk hooks under the same interface the app used before
// so existing useAuth() calls keep working with minimal changes.
import { useUser, useClerk, SignInButton } from '@clerk/nextjs';

export interface AuthContextUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export function useAuth() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const mappedUser: AuthContextUser | null = user
    ? {
        uid: user.id,
        displayName: user.fullName,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        photoURL: user.imageUrl ?? null,
      }
    : null;

  return {
    user: mappedUser,
    loading: !isLoaded,
    logout: () => signOut(),
  };
}

// AuthProvider is now just a passthrough — ClerkProvider is in layout.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
