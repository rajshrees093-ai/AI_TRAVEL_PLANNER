"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  CircleUserRound,
  Compass,
  Home,
  LogOut,
  Map,
  Menu,
  Moon,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { Brand, RoamWiseLogo } from "@/components/ui/BrandComponents";

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
  const pathname = usePathname() || "/dashboard";
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    theme,
    toggleTheme,
    signOut,
  } = useRoamWise();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicDashboardRoute =
    allowPublicPreview || pathname === "/dashboard" || pathname === "/";

  if (!isAuthenticated && !isPublicDashboardRoute) {
    return (
      <div className="access-gate">
        <div className="gate-card">
          <RoamWiseLogo />
          <span className="eyebrow">A LITTLE JOURNEY STARTS HERE</span>
          <h1>
            Make room for a<br />
            <em>great trip.</em>
          </h1>
          <p>
            Sign in with your RouteBloom account, or create a free account to
            plan, customize, and save your itineraries.
          </p>
          <button
            className="button button-primary button-wide"
            onClick={() =>
              router.push(
                `/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`
              )
            }
          >
            Sign in to RouteBloom <ArrowRight size={17} />
          </button>
          <button
            className="button button-quiet button-wide"
            onClick={() =>
              router.push(
                `/signup?redirect=${encodeURIComponent(pathname || "/dashboard")}`
              )
            }
          >
            Create a free account
          </button>
          <button
            className="button button-quiet button-wide"
            onClick={() => router.push("/dashboard")}
          >
            Explore dashboard preview
          </button>
          <span className="gate-note">
            <ShieldCheck size={14} /> Your saved itineraries stay private to
            your account.
          </span>
        </div>
        <div
          className="gate-photo"
          style={{
            backgroundImage: "url('/places/manali-solang-valley.jpg')",
          }}
        />
      </div>
    );
  }

  const navigate = (path: string, requiresAuth = false) => {
    setMobileOpen(false);
    if (requiresAuth && !isAuthenticated) {
      router.push(`/signup?redirect=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  const currentTitle = pathname.startsWith("/dashboard")
    ? "Your workspace"
    : pathname.startsWith("/create-trip")
    ? "Plan a trip"
    : pathname.startsWith("/saved-trips")
    ? "Travel collection"
    : pathname.startsWith("/profile")
    ? "Your profile"
    : title || "Your itinerary";

  const avatarInitial = (user?.name || "T").slice(0, 1).toUpperCase();

  return (
    <div className="app-frame">
      <aside className={`sidebar no-print ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <Link href="/" className="brand-anchor">
            <Brand />
          </Link>
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <button
            type="button"
            className={`side-link ${pathname === "/dashboard" ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <Home />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            className={`side-link ${pathname.startsWith("/create-trip") ? "active" : ""}`}
            onClick={() => navigate("/create-trip/destination", true)}
          >
            <Plus />
            <span>Plan a new trip</span>
            <span className="nav-plus">+</span>
          </button>
          <button
            type="button"
            className="side-link"
            onClick={() => navigate("/dashboard#explore-destinations")}
          >
            <Compass />
            <span>Explore destinations</span>
          </button>
          <button
            type="button"
            className={`side-link ${pathname.startsWith("/trips/") ? "active" : ""}`}
            onClick={() => navigate("/saved-trips", true)}
          >
            <Map />
            <span>My trips</span>
          </button>
          <button
            type="button"
            className={`side-link ${pathname.startsWith("/saved-trips") ? "active" : ""}`}
            onClick={() => navigate("/saved-trips", true)}
          >
            <Bookmark />
            <span>Saved trips</span>
          </button>
        </nav>

        <p className="nav-label nav-label-spaced">ACCOUNT</p>
        <nav className="side-nav" aria-label="Account navigation">
          <button
            type="button"
            className={`side-link ${pathname.startsWith("/profile") ? "active" : ""}`}
            onClick={() => navigate("/profile", true)}
          >
            <CircleUserRound />
            <span>Profile</span>
          </button>
          <button
            type="button"
            className="side-link"
            onClick={() => navigate("/profile#account-settings", true)}
          >
            <Settings2 />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          {isAuthenticated && user ? (
            <div className="profile-mini">
              <div className="avatar">{avatarInitial}</div>
              <div className="profile-mini-copy">
                <strong>{user.name || "Traveler"}</strong>
                <span>{user.email}</span>
              </div>
              <button
                type="button"
                className="icon-btn tiny"
                aria-label="Sign out"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="profile-mini">
              <div className="avatar">G</div>
              <div className="profile-mini-copy">
                <strong>Guest Explorer</strong>
                <span>Sign in to save trips</span>
              </div>
              <button
                type="button"
                className="icon-btn tiny"
                aria-label="Sign in"
                onClick={() => router.push("/login")}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
          <div className="sidebar-tip">
            <span className="tip-icon">
              <Sparkles size={15} />
            </span>
            <div>
              <b>A little room to wander.</b>
              <p>Your plan, your pace.</p>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="scrim no-print"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className="app-main">
        <header className="topbar no-print">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-btn mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="eyebrow">
                ROUTEBLOOM <span>·</span> {(title || currentTitle).toUpperCase()}
              </div>
              <div className="breadcrumb">
                {breadcrumbs && breadcrumbs.length > 0 ? (
                  breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      {crumb.href ? (
                        <button
                          type="button"
                          onClick={() => navigate(crumb.href!)}
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                      {idx < breadcrumbs.length - 1 && (
                        <ChevronRight size={13} />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <span>{title || currentTitle}</span>
                )}
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            {actions}
            <span className="mode-pill">
              <span className="mode-dot" />
              {isAuthenticated ? "Verified catalog" : "Guest preview"}
            </span>
            <button
              type="button"
              className="icon-btn theme-toggle"
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="avatar avatar-small"
              onClick={() =>
                navigate(isAuthenticated ? "/profile" : "/login")
              }
              aria-label="Open profile"
            >
              {avatarInitial}
            </button>
          </div>
        </header>

        <div className="content-wrap">{children}</div>
      </main>

      <nav className="mobile-bottom-nav no-print" aria-label="Quick navigation">
        <button type="button" onClick={() => navigate("/dashboard")}>
          <Home size={19} />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/create-trip/destination", true)}
        >
          <Plus size={19} />
          <span>Plan</span>
        </button>
        <button type="button" onClick={() => navigate("/saved-trips", true)}>
          <Bookmark size={19} />
          <span>Trips</span>
        </button>
        <button type="button" onClick={() => navigate("/profile", true)}>
          <CircleUserRound size={19} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
