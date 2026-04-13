"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Compass,
  Target,
  History,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/assessment", label: "Assessment", icon: Compass },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/history", label: "History", icon: History },
];

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

function NavContent({ user, pathname }: DashboardNavProps & { pathname: string }) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          IG
        </div>
        <span className="text-lg font-semibold">I-Goal</span>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname() ?? "/dashboard";

  return (
    <>
      {/* Mobile nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 border-b bg-white px-4 py-3 md:hidden">
        <Sheet>
          <SheetTrigger className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <NavContent user={user} pathname={pathname} />
          </SheetContent>
        </Sheet>
        <span className="font-semibold">I-Goal</span>
      </div>
      <div className="h-14 md:hidden" />

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-white md:block">
        <NavContent user={user} pathname={pathname} />
      </aside>
    </>
  );
}
