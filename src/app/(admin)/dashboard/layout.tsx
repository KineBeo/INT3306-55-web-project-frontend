import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-screen min-h-screen bg-neutral-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
