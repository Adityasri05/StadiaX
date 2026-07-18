import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07111F]">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-grid-pattern relative">
          {children}
        </main>
      </div>
    </div>
  );
}
