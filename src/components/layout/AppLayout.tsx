"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Dumbbell, Users, Settings, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/useSession";
import { auth } from "@/lib/api";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Dumbbell },
  { name: "Clientes", href: "/dashboard/clients", icon: Users },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/clients": "Clientes",
  "/dashboard/clients/new": "Nuevo Cliente",
  "/dashboard/settings": "Configuración",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (/\/dashboard\/clients\/[^/]+\/new-assessment/.test(pathname)) return "Nueva Evaluación";
  if (/\/dashboard\/clients\/[^/]+\/assessments\/[^/]+/.test(pathname)) return "Detalle de Evaluación";
  if (/\/dashboard\/clients\/[^/]+\/assessments/.test(pathname)) return "Evaluaciones";
  if (/\/dashboard\/clients\/[^/]+\/photos/.test(pathname)) return "Fotos de Progreso";
  if (/\/dashboard\/clients\/[^/]+/.test(pathname)) return "Perfil del Cliente";
  return "Dashboard";
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useSession();

  function getInitials(name: string | null | undefined, email: string | null | undefined) {
    if (name) {
      const parts = name.split(" ");
      return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
    }
    if (email) return email[0].toUpperCase();
    return "PT";
  }

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  async function handleLogout() {
    try {
      await auth.logout();
      toast.success("Sesión cerrada");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Error al cerrar sesión");
    }
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for Desktop */}
      <aside className="hidden border-r bg-sidebar md:flex md:w-64 lg:w-72 md:flex-col">
        <div className="flex h-full max-h-screen flex-col">
          {/* Logo */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
              <img
                src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
                alt="Jorge Ortega PT"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-4">
            <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                      active
                        ? "bg-primary/10 text-primary font-semibold border-l-[3px] border-primary -ml-px"
                        : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User footer */}
          <div className="border-t p-3 lg:p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className="text-xs">
                  {loading ? "..." : getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "Entrenador"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Menú de usuario</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Configuración</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Sidebar Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetTitle>Menu</SheetTitle>
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <img
                    src="https://res.cloudinary.com/duhsqdstl/image/upload/v1770782105/LOGO_CON_TRAZO_-_TRANSPARENTE_ytfdn6.png"
                    alt="Jorge Ortega PT"
                    className="h-8 w-auto"
                  />
                  <span className="sr-only">Jorge Ortega PT</span>
                </Link>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                      isActive(item.href) ? "bg-muted text-foreground font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Page title */}
          <h2 className="hidden text-sm font-medium text-muted-foreground md:block">
            {pageTitle}
          </h2>

          <div className="w-full flex-1" />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                  <AvatarFallback>
                    {loading ? "..." : getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{user?.name || "Usuario"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Configuración</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
