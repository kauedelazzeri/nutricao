import { NavLink } from "react-router";

const tabs = [
  { to: "/app/patient/timeline", icon: "📸", label: "Início" },
  { to: "/app/patient/my-evaluations", icon: "📋", label: "Avaliações" },
  { to: "/app/patient/health-profile", icon: "👤", label: "Perfil" },
];

export default function BottomTabBar() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid #e5e7eb',
      boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.04)',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '64px',
        maxWidth: '448px',
        margin: '0 auto'
      }}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.125rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              color: isActive ? '#10b981' : '#9ca3af',
              fontWeight: isActive ? '600' : '500',
              textDecoration: 'none'
            })}
          >
            <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
            <span style={{ fontSize: '11px' }}>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
