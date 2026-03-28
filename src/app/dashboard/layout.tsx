import MobileNav from "@/components/ui/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MobileNav />
      {children}
    </>
  );
}
