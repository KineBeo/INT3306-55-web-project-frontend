import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-full min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
