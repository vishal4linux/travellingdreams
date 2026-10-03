import { AdminChrome } from "@/components/admin/AdminChrome";
import { getAdminSession } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  return <AdminChrome role={session?.role}>{children}</AdminChrome>;
}