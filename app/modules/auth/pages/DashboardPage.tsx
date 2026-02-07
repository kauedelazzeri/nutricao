import { useNavigate } from 'react-router';
import { useAuth } from '~/shared/contexts/AuthContext';

export default function DashboardPage() {
  const { user, userType, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Erro ao sair. Tente novamente.');
    }
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <p>Redirecionando para login...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem',
      padding: '2rem'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        minWidth: '300px'
      }}>
        <h1 style={{ marginBottom: '1rem' }}>
          Bem-vindo! 👋
        </h1>
        
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            {user.user_metadata.full_name || user.email}
          </p>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            {user.email}
          </p>
        </div>

        <div style={{
          padding: '1rem',
          backgroundColor: userType === 'patient' ? '#e8f5e9' : '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            fontSize: '1.1rem',
            color: userType === 'patient' ? '#2e7d32' : '#1565c0',
            fontWeight: '500'
          }}>
            {userType === 'patient' ? '🍎 Paciente' : '👨‍⚕️ Nutricionista'}
          </p>
        </div>

        {/* Actions para Paciente */}
        {userType === 'patient' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => navigate('/app/patient/register-meal')}
              style={{
                padding: '1rem',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              📸 Registrar Refeição
            </button>

            <button
              onClick={() => navigate('/app/patient/timeline')}
              style={{
                padding: '1rem',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              📅 Ver Timeline
            </button>

            <button
              onClick={() => navigate('/app/patient/health-profile')}
              style={{
                padding: '1rem',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              🏃 Perfil de Saúde
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <button
            onClick={handleSignOut}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>

          <button
            onClick={() => navigate('/demo/patient')}
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '0.95rem',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Ver protótipo (demo)
          </button>
        </div>
      </div>

      <p style={{
        color: '#999',
        fontSize: '0.9rem',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        Esta é uma página de teste. Em breve você terá acesso ao dashboard completo.
      </p>
    </div>
  );
}
