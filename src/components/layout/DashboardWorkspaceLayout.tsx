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
}: DashboardWorkspaceLayoutProps) {
  const pathname = usePathname() || "/dashboard";
  const router = useRouter();
  const {
    user,
    trips,
    isAuthenticated,
    theme,
    toggleTheme,
    signOut,
    toasts,
    dismissToast,
  } = useRoamWise();

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (path: string) => {
    setMobileOpen(false);
    router.push(path);
  };

  const handleExploreDestinations = () => {
    setMobileOpen(false);
    if (pathname === "/dashboard" && typeof document !== "undefined") {
      const el = document.getElementById("explore-destinations");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push("/create-trip/destination");
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
            onClick={() => navigate("/create-trip/destination")}
          >
            <Plus />
            <span>Plan a new trip</span>
            <span className="nav-plus">+</span>
          </button>
          <button
            type="button"
            className="side-link"
            onClick={handleExploreDestinations}
          >
            <Compass />
            <span>Explore destinations</span>
          </button>
          <button
            type="button"
            className={`side-link ${pathname.startsWith("/trips/") ? "active" : ""}`}
            onClick={() =>
              navigate(
                trips.length > 0 ? `/trips/${trips[0].id}` : "/saved-trips"
              )
            }
          >
            <Map />
            <span>My trips</span>
          </button>
          <button
            type="button"
            className={`side-link ${pathname.startsWith("/saved-trips") ? "active" : ""}`}
            onClick={() => navigate("/saved-trips")}
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
            onClick={() => navigate("/profile")}
          >
            <CircleUserRound />
            <span>Profile</span>
          </button>
          <button
            type="button"
            className="side-link"
            onClick={() => navigate("/profile#account-settings")}
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
                <span>Sign in or plan freely</span>
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
              {isAuthenticated ? "Verified catalog" : "Workspace ready"}
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
              onClick={() => navigate("/profile")}
              aria-label="Open profile"
            >
              {avatarInitial}
            </button>
          </div>
        </header>

        <div className="content-wrap">{children}</div>

        {toasts.length > 0 && (
          <div className="toast-stack no-print" role="status" aria-live="polite">
            {toasts.map((t) => (
              <div
                key={t.id}
                className="toast"
                onClick={() => dismissToast(t.id)}
                style={{ cursor: "pointer" }}
              >
                <Sparkles size={16} />
                <div>
                  <strong style={{ display: "block", fontSize: "0.86rem" }}>
                    {t.title}
                  </strong>
                  {t.description && (
                    <span style={{ fontSize: "0.78rem", opacity: 0.85 }}>
                      {t.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="mobile-bottom-nav no-print" aria-label="Quick navigation">
        <button type="button" onClick={() => navigate("/dashboard")}>
          <Home size={19} />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/create-trip/destination")}
        >
          <Plus size={19} />
          <span>Plan</span>
        </button>
        <button type="button" onClick={() => navigate("/saved-trips")}>
          <Bookmark size={19} />
          <span>Trips</span>
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <CircleUserRound size={19} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
