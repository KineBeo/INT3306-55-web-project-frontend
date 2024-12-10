import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-neutral-50 overflow-hidden">
      <Sidebar />
      <div className="max-w-full self-center">{children}</div>
    </div>
  );
}
