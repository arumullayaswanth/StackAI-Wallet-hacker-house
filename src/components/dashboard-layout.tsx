'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bot,
  Settings,
  History,
  PanelLeft,
  Package,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ConnectWallet } from '@/components/connect-wallet';
import { NetworkSwitcher } from '@/components/network-switcher';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/history', label: 'History', icon: History },
  { href: '#', label: 'Integrations', icon: Package },
  { href: '#', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navContent = (
    <nav className="grid gap-2 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            pathname === item.href
              ? 'bg-muted text-primary'
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <TooltipProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-card md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Logo />
            </div>
            <div className="flex-1">
              <div className="grid items-start p-2 lg:p-4">
                {navContent}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0 w-full max-w-sm">
                 <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Logo />
                 </div>
                 <div className="p-4">{navContent}</div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* Optional: Can add a search bar here */}
            </div>
            <NetworkSwitcher />
            <ConnectWallet />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
