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
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { RoamWiseLogo } from "@/components/ui/BrandComponents";
import { findDestinationInfo } from "@/lib/destinations-catalog";
import { cn } from "@/lib/utils";

interface DashboardWorkspaceLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  allowPublicPreview?: boolean;
}

export function DashboardWorkspaceLayout({
  children,
  title,
  breadcrumbs,
  actions,
  allowPublicPreview = false,
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

  const isPublicDashboardRoute =
    allowPublicPreview || pathname === "/dashboard" || pathname === "/";

  if (!isAuthenticated && !isPublicDashboardRoute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-surface border border-border rounded-3xl max-w-md w-full p-8 text-center shadow-elevated">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-sand text-heading text-xs font-bold mb-2">
            Account Required to Plan & Save
          </span>
          <h1 className="text-2xl font-heading font-bold text-heading">
            Create Your Account or Sign In to Continue
          </h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            To search destinations, run the step-by-step AI itinerary builder, and store your travel plans in our backend, please register or sign in first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href={`/signup?redirect=${encodeURIComponent(pathname || "/create-trip/destination")}`}
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up Free</span>
            </Link>
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname || "/create-trip/destination")}`}
              className="flex-1 py-3 px-4 rounded-xl border border-border text-heading hover:bg-sand/40 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="inline-block mt-5 text-xs font-semibold text-muted hover:text-primary"
          >
            ← Return to Dashboard Showcase
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard" || pathname === "/",
      requiresAuth: false,
    },
    {
      label: "Plan New Trip",
      href: "/create-trip/destination",
      icon: PlusCircle,
      active: pathname.startsWith("/create-trip"),
      requiresAuth: true,
    },
    {
      label: "Explore Destinations",
      href: "/dashboard#explore-destinations",
      icon: Compass,
      active: false,
      requiresAuth: false,
    },
    {
      label: "My Trips",
      href: "/saved-trips",
      icon: Briefcase,
      active: pathname.startsWith("/trips/"),
      requiresAuth: true,
    },
    {
      label: "Saved Trips",
      href: "/saved-trips",
      icon: Bookmark,
      active: pathname === "/saved-trips",
      requiresAuth: true,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
      requiresAuth: true,
    },
    {
      label: "Settings",
      href: "/profile#account-settings",
      icon: Settings,
      active: false,
      requiresAuth: true,
    },
  ];

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = headerSearch.trim();
    if (!q) return;
    const matched = findDestinationInfo(q);
    resetActiveDraft({
      placeId: matched.placeId,
      name: matched.name,
      country: matched.stateOrCountry,
      heroImage: matched.heroImage,
    });
    if (!isAuthenticated) {
      router.push(
        `/signup?redirect=${encodeURIComponent("/create-trip/dates")}&dest=${encodeURIComponent(matched.name)}`
      );
      return;
    }
    router.push("/create-trip/dates");
  };

  const handleNavClick = (
    e: React.MouseEvent,
    href: string,
    requiresAuth: boolean
  ) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault();
      router.push(`/signup?redirect=${encodeURIComponent(href)}`);
    }
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
                onClick={(e) => handleNavClick(e, item.href, item.requiresAuth)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-white shadow-xs"
                    : "text-muted hover:text-heading hover:bg-sand/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.requiresAuth && !isAuthenticated && (
                  <Lock className="w-3 h-3 opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Card or Sign Up / Sign In CTA */}
        <div className="p-3 border-t border-border">
          {isAuthenticated && user ? (
            <div
              className={cn(
                "flex items-center gap-3 p-2 rounded-xl bg-background border border-border",
                collapsed && "justify-center"
              )}
            >
              <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-heading font-bold text-sm flex items-center justify-center shrink-0">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-heading truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-muted truncate">
                    {user.email}
                  </p>
                </div>
              )}
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    router.push("/dashboard");
                  }}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-1.5 text-muted hover:text-red-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : !collapsed ? (
            <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-xs font-heading font-bold text-heading">
                Ready to Plan Your Trip?
              </p>
              <p className="text-[11px] text-muted leading-snug">
                Sign up or log in to search destinations & save AI itineraries.
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  href="/signup?redirect=/create-trip/destination"
                  className="py-2 px-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold text-center transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login?redirect=/create-trip/destination"
                  className="py-2 px-2.5 rounded-xl bg-surface border border-border hover:bg-sand/40 text-heading text-xs font-semibold text-center transition-colors"
                >
                  Log In
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              title="Sign In"
              className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mx-auto"
            >
              <LogIn className="w-4 h-4" />
            </Link>
          )}
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
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, item.href, item.requiresAuth);
                    }}
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
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-heading">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      router.push("/dashboard");
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/signup?redirect=/create-trip/destination"
                    className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-semibold text-center"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login?redirect=/create-trip/destination"
                    className="flex-1 py-2 rounded-xl border border-border text-heading text-xs font-semibold text-center"
                  >
                    Log In
                  </Link>
                </div>
              )}
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
            {/* Quick Destination Search (Triggers Signup/Login if not authenticated) */}
            <form
              onSubmit={handleHeaderSearch}
              className="hidden md:flex items-center bg-background border border-border rounded-xl px-3 py-1.5 w-64 focus-within:border-primary transition-colors"
            >
              <Search className="w-4 h-4 text-primary mr-2 shrink-0" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search destination or holy site..."
                aria-label="Search destination or holy site"
                className="bg-transparent text-xs text-heading placeholder:text-muted focus:outline-none w-full"
              />
            </form>

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

            {isAuthenticated && user ? (
              <Link
                href="/profile"
                title="Profile & Settings"
                className="w-9 h-9 rounded-full bg-primary text-white font-heading font-bold text-xs flex items-center justify-center hover:bg-primary-dark transition-colors"
              >
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login?redirect=/create-trip/destination"
                  className="px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-sand/40 text-heading text-xs font-semibold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup?redirect=/create-trip/destination"
                  className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
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
              pathname === "/dashboard" || pathname === "/"
                ? "text-primary"
                : "text-muted"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href={
              isAuthenticated
                ? "/create-trip/destination"
                : "/signup?redirect=/create-trip/destination"
            }
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg",
              pathname.startsWith("/create-trip") ? "text-primary" : "text-muted"
            )}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Plan Trip</span>
          </Link>
          <Link
            href={isAuthenticated ? "/saved-trips" : "/login?redirect=/saved-trips"}
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
            href={isAuthenticated ? "/profile" : "/login?redirect=/profile"}
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg",
              pathname === "/profile" ? "text-primary" : "text-muted"
            )}
          >
            <User className="w-4 h-4" />
            <span>{isAuthenticated ? "Profile" : "Sign In"}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
