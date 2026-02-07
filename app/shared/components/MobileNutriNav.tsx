import { NavLink } from "react-router";
import { useAuth } from "~/shared/contexts/AuthContext";

const menuItems = [
  { to: "/app/nutritionist/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/app/nutritionist/profile", icon: "👩‍⚕️", label: "Perfil" },
];

export default function MobileNutriNav() {
  const { signOut } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-green-600"
                  : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[11px] font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={signOut}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="text-[11px] font-medium">Sair</span>
        </button>
      </div>
    </nav>
  );
}
