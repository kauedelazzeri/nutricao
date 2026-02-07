import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/shared/contexts/AuthContext';

export default function CallbackPage() {
  const { user, userType, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Sem usuário, volta para login
      navigate('/auth/login');
      return;
    }

    if (userType === null) {
      // Primeiro acesso - precisa escolher tipo de usuário
      navigate('/auth/setup');
    } else {
      // Usuário existente - redireciona conforme tipo
      if (userType === 'patient') {
        navigate('/app/patient/timeline');
      } else {
        navigate('/app/nutritionist/dashboard');
      }
    }
  }, [user, userType, loading, navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #10b981',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        Verificando autenticação...
      </p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
