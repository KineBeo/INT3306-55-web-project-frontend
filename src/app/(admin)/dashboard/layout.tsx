import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-full min-h-screen bg-neutral-100">
      <Sidebar />
      {children}
    </div>
  );
};
