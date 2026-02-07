import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/shared/contexts/AuthContext';
import { supabase } from '~/shared/services/supabase';

export default function SetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUserTypeSelection = async (type: 'patient' | 'nutritionist') => {
    if (!user) {
      alert('Erro: usuário não autenticado');
      navigate('/auth/login');
      return;
    }

    setLoading(true);

    try {
      // Criar registro na tabela users
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name || user.email!.split('@')[0],
          user_type: type
        } as any);

      // Ignorar erro de duplicate key (usuário já existe)
      if (userError && !userError.message.includes('duplicate key')) {
        throw userError;
      }

      // Se for nutricionista, criar registro na tabela nutritionists
      if (type === 'nutritionist') {
        const { error: nutritionistError } = await supabase
          .from('nutritionists')
          .insert({
            id: user.id,
            specialties: [], // Será preenchido depois no perfil
            consultation_fee: 0, // Será preenchido depois no perfil
            rating: 0,
            total_evaluations: 0,
            available: false // Indisponível até preencher perfil
          } as any);

        // Ignorar erro de duplicate key (nutricionista já existe)
        if (nutritionistError && !nutritionistError.message.includes('duplicate key')) {
          throw nutritionistError;
        }
      }

      // Aguardar um pouco para o banco processar
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirecionar para dashboard (o AuthContext irá refetch automaticamente)
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Erro ao configurar conta. Tente novamente.');
      setLoading(false);
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
        <p>Redirecionando...</p>
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
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Bem-vindo!</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          {user.user_metadata.full_name || user.email}
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'normal' }}>
          Como você deseja usar o app?
        </h2>
      </div>

      <div style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => handleUserTypeSelection('patient')}
          disabled={loading}
          style={{
            padding: '2rem 3rem',
            fontSize: '1.2rem',
            backgroundColor: loading ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <span style={{ fontSize: '3rem' }}>🍎</span>
          <span>Sou Paciente</span>
        </button>

        <button
          onClick={() => handleUserTypeSelection('nutritionist')}
          disabled={loading}
          style={{
            padding: '2rem 3rem',
            fontSize: '1.2rem',
            backgroundColor: loading ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <span style={{ fontSize: '3rem' }}>👨‍⚕️</span>
          <span>Sou Nutricionista</span>
        </button>
      </div>

      {loading && (
        <p style={{ color: '#666', marginTop: '1rem' }}>
          Configurando sua conta...
        </p>
      )}
    </div>
  );
}
