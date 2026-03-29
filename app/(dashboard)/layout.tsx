import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="ml-60 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
