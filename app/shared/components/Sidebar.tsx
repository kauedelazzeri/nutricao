import { NavLink } from "react-router";
import { useAuth } from "~/shared/contexts/AuthContext";

const menuItems = [
  { to: "/app/nutritionist/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/app/nutritionist/profile", icon: "👩‍⚕️", label: "Meu Perfil" },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-green-600 flex items-center gap-2">
          🥗 NutriSnap
        </h1>
        <p className="text-xs text-gray-400 mt-1">Painel da Nutricionista</p>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-10 h-10 rounded-full bg-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
              👤
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.user_metadata?.full_name || 'Nutricionista'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
        >
          <span>🚪</span>
          Sair
        </button>
      </div>
    </aside>
  );
}
