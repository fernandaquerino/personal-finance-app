import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { BottomNav } from "@/components/ui/BottomNav";
import { Sidebar } from "@/components/ui/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="min-h-0 flex-1 overflow-y-auto pb-[96px] lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
