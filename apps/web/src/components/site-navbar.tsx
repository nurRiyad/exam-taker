import { NavbarAccountAction } from "@/components/navbar-account-action";
import { SiteNavbarLinks } from "@/components/site-navbar-links";
import { NavbarBrandLink } from "@/components/navbar-brand-link";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/80 bg-white/90 shadow-[0_4px_20px_-12px_rgba(49,46,129,0.22)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center gap-3 px-3 py-2 sm:px-6">
        <NavbarBrandLink />

        <SiteNavbarLinks />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <SiteNavbarLinks mobile />
          <div className="hidden sm:block">
            <NavbarAccountAction />
          </div>
        </div>
      </div>
    </header>
  );
}
