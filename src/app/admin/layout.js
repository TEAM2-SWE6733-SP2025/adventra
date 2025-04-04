import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import Link from "next/link";
import { FaHome, FaUsers, FaCog } from "react-icons/fa"; // Import icons from react-icons/fa

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session?.user?.isAdmin) {
    redirect("/"); // Redirect non-admin users
    return null; // Prevent rendering the layout
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: FaHome },
    { name: "Users", href: "/admin/users", icon: FaUsers },
    { name: "Settings", href: "/admin/settings", icon: FaCog },
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="h-full flex flex-col shadow-lg border-r border-gray-700">
        {/* Sidebar Header */}
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  <item.icon className="w-5 h-5 mr-3" /> {/* Icon */}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Current User Info */}
        <div className="p-4 border-t border-gray-700 text-sm text-gray-300 flex items-center gap-3">
          <img
            src={session.user.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-500"
          />
          <div>
            <p>Logged in as:</p>
            <p className="font-semibold">
              {session.user.name || session.user.email}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full">
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
