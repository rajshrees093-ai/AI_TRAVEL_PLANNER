"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Compass,
  Briefcase,
  Bookmark,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { RoamWiseLogo } from "@/components/ui/BrandComponents";
import { cn } from "@/lib/utils";

interface DashboardWorkspaceLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export function DashboardWorkspaceLayout({
  children,
  title,
  breadcrumbs,
  actions,
}: DashboardWorkspaceLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    theme,
    toggleTheme,
    signOut,
    resetActiveDraft,
  } = useRoamWise();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-8 text-center shadow-soft">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-heading font-bold text-heading">
            Sign in to access your travel workspace
          </h1>
          <p className="text-sm text-muted mt-2">
            Your saved trips, custom preferences, and AI itineraries are protected by your RoamWise account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/login"
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors"
            >
              Go to Sign In
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 rounded-xl border border-border text-heading hover:bg-sand/40 font-medium text-sm transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Plan New Trip",
      href: "/create-trip/destination",
      icon: PlusCircle,
      active: pathname.startsWith("/create-trip"),
    },
    {
      label: "Explore Destinations",
      href: "/dashboard#explore-destinations",
      icon: Compass,
      active: false,
    },
    {
      label: "My Trips",
      href: "/saved-trips",
      icon: Briefcase,
      active: pathname.startsWith("/trips/"),
    },
    {
      label: "Saved Trips",
      href: "/saved-trips",
      icon: Bookmark,
      active: pathname === "/saved-trips",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
    {
      label: "Settings",
      href: "/profile#account-settings",
      icon: Settings,
      active: false,
    },
  ];

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearch.trim()) return;
    resetActiveDraft({
      placeId: `ChIJ_search_${headerSearch.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      name: headerSearch.trim(),
      country: "Selected Destination",
    });
    router.push("/create-trip/destination");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Left Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-surface sticky top-0 h-screen transition-all duration-200 z-30 no-print",
          collapsed ? "w-20" : "w-[252px]"
        )}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          {!collapsed ? (
            <RoamWiseLogo size="md" />
          ) : (
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white mx-auto"
              title="RoamWise"
            >
              <Compass className="w-5 h-5" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-sand/40 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-white shadow-xs"
                    : "text-muted hover:text-heading hover:bg-sand/40"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Card */}
        <div className="p-3 border-t border-border">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl bg-background border border-border",
              collapsed && "justify-center"
            )}
          >
            <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-heading font-bold text-sm flex items-center justify-center shrink-0">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "RW"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-heading truncate">
                  {user?.name || "Traveler"}
                </p>
                <p className="text-[11px] text-muted truncate">
                  {user?.email || "explorer@roamwise.travel"}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  router.push("/login");
                }}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-1.5 text-muted hover:text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[82vw] bg-surface h-full flex flex-col z-10 shadow-elevated">
            <div className="h-16 px-5 flex items-center justify-between border-b border-border">
              <RoamWiseLogo size="md" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 text-muted hover:text-heading rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      item.active
                        ? "bg-primary text-white"
                        : "text-muted hover:text-heading hover:bg-sand/40"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    router.push("/login");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 no-print">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-1 rounded-xl text-heading hover:bg-sand/40"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav
                  aria-label="Breadcrumb"
                  className="hidden sm:flex items-center gap-1.5 text-xs text-muted mb-0.5"
                >
                  {breadcrumbs.map((b, i) => (
                    <React.Fragment key={i}>
                      {b.href ? (
                        <Link
                          href={b.href}
                          className="hover:text-primary transition-colors"
                        >
                          {b.label}
                        </Link>
                      ) : (
                        <span className="text-heading font-medium">
                          {b.label}
                        </span>
                      )}
                      {i < breadcrumbs.length - 1 && <span>/</span>}
                    </React.Fragment>
                  ))}
                </nav>
              )}
              <h1 className="text-base sm:text-lg font-heading font-bold text-heading truncate">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Destination Search */}
            <form
              onSubmit={handleHeaderSearch}
              className="hidden md:flex items-center bg-background border border-border rounded-xl px-3 py-1.5 w-60 focus-within:border-primary transition-colors"
            >
              <Search className="w-4 h-4 text-muted mr-2 shrink-0" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Quick plan destination..."
                aria-label="Quick plan destination"
                className="bg-transparent text-xs text-heading placeholder:text-muted focus:outline-none w-full"
              />
            </form>

            {/* Explicit Demo / Verified Catalog Badge */}
            <span
              title="Using curated verified catalog data. Add OpenAI & Google Maps API keys in .env.local for live cloud calls."
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-sand text-heading border border-sand-dark/50"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span>Demo & Verified Catalog</span>
            </span>

            {/* Theme Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="p-2 rounded-xl border border-border bg-background text-muted hover:text-heading transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {actions}

            {/* Profile Avatar Link */}
            <Link
              href="/profile"
              title="Profile & Settings"
              className="w-9 h-9 rounded-full bg-primary text-white font-heading font-bold text-xs flex items-center justify-center hover:bg-primary-dark transition-colors"
            >
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "RW"}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          aria-label="Mobile bottom navigation"
          className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-surface border-t border-border flex items-center justify-around z-30 px-2 no-print"
        >
          <Link
            href="/dashboard"
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg",
              pathname === "/dashboard" ? "text-primary" : "text-muted"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/create-trip/destination"
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg",
              pathname.startsWith("/create-trip") ? "text-primary" : "text-muted"
            )}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Plan Trip</span>
          </Link>
          <Link
            href="/saved-trips"
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg",
              pathname === "/saved-trips" || pathname.startsWith("/trips/")
                ? "text-primary"
                : "text-muted"
            )}
          >
            <Bookmark className="w-4 h-4" />
            <span>My Trips</span>
          </Link>
          <Link
            href="/profile"
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg",
              pathname === "/profile" ? "text-primary" : "text-muted"
            )}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
