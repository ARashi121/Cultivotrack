"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sprout, Menu, Home, FlaskConical, BarChart3, Trees, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect } from 'react';

const navItems = [
  { href: '/', label: 'TC Plants', icon: Home, roles: ['admin', 'technician', 'viewer'] },
  { href: '/protocol-development', label: 'Protocol Development', icon: FlaskConical, roles: ['admin', 'technician', 'viewer'] },
  { href: '/hardening', label: 'Hardening', icon: Trees, roles: ['admin', 'technician', 'viewer'] },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'technician', 'viewer'] },
  { href: '/admin', label: 'Admin', icon: Shield, roles: ['admin'] },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary font-headline font-semibold text-lg">
      <Sprout className="h-6 w-6" />
      <span>CultivoTrack</span>
    </Link>
  );
}

function NavLink({ href, label, icon: Icon, userRole }: { href: string; label: string; icon: React.ElementType, userRole: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const item = navItems.find(i => i.href === href);
  if (!item || !item.roles.includes(userRole)) {
    return null;
  }


  return (
    <Link href={href}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start"
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}

function SidebarNav({ userRole }: { userRole: string}) {
  return (
    <nav className="flex flex-col gap-2 px-2">
      {navItems.map((item) => (
        <NavLink key={item.href} {...item} userRole={userRole} />
      ))}
    </nav>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Sprout className="h-8 w-8 text-primary animate-pulse" />
        </div>
    )
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1 py-2">
            <SidebarNav userRole={user.role} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex-1 md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <div className="flex h-14 items-center border-b mb-4">
                    <Logo />
                  </div>
                  <SidebarNav userRole={user.role} />
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:block">
                 <Logo />
            </div>

            <div className="flex-1 flex justify-end">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                         <DropdownMenuItem disabled className="capitalize text-xs text-muted-foreground pl-8 -mt-1">{user.role}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
