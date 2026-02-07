import { NavLink } from "react-router";

const tabs = [
  { to: "/app/patient/timeline", icon: "📸", label: "Início" },
  { to: "/app/patient/my-evaluations", icon: "📋", label: "Avaliações" },
  { to: "/app/patient/health-profile", icon: "👤", label: "Perfil" },
];

export default function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-green-600"
                  : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[11px] font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
