import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export default function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteNavbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
