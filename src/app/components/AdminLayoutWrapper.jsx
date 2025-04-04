import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import AdminLayout from "@/app/admin/layout";

export default async function AdminLayoutWrapper({ children }) {
  const session = await getSession();

  if (!session?.user?.isAdmin) {
    // Redirect non-admin users
    redirect("/");
    return null;
  }

  return <AdminLayout session={session}>{children}</AdminLayout>;
}
