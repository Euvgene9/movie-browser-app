'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold italic text-foreground">
          MovieBrowser
        </Link>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/search" className="hover:text-foreground">
            Search
          </Link>

          {isAuthenticated && (
            <>
              <Link href="/bookmarks" className="hover:text-foreground">
                Bookmarks
              </Link>
              <Link href="/recommendations" className="hover:text-foreground">
                For you
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
            </Button>
            ) : (
            <>
                <Button variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm">
                <Link href="/signup">Sign up</Link>
                </Button>
            </>
            )}

            <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}