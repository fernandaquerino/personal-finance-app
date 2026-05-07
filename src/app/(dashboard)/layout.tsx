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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
