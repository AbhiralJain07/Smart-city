import { getAdminDashboardData } from "@/lib/cms/content";
import { requireAdminSession } from "@/lib/cms/auth";

import AdminDashboard from "../components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdminSession();
  const { store } = await getAdminDashboardData();

  return <AdminDashboard adminEmail={session.email} initialStore={store} />;
}
