'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '@/components/mode-toggle';
import { 
  ChevronLeft, 
  Menu, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Building
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
    },
    {
      name: 'Match Candidate',
      href: '/candidates',
      icon: Users,
    },
    {
      name: 'Resume',
      href: '/resume',
      icon: FileText,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const SidebarContent = () => (
    <div className={cn(
      "flex h-full flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md">
              <Building className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-blue-500 bg-clip-text text-transparent">
              RecruAI
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md">
              <Building className="h-5 w-5 text-white" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform text-slate-600 dark:text-slate-300",
            isCollapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {user.companyName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div className={cn("rounded-xl" ,isActive ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-white" : "text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white")}>

              
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 flex-shrink-0",
                  
                )} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
        <div className="mb-2">
          <ModeToggle isCollapsed={isCollapsed} />
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start dark:text-slate-400 text-white bg-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden hover:bg-slate-200 dark:hover:bg-slate-700">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
} 