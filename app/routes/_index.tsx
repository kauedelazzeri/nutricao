import { Link } from 'react-router';

export default function Index() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
        Nutrição App 🍎
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px' }}>
        Conecte-se com seu nutricionista e acompanhe sua jornada de saúde
      </p>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <Link
          to="/auth/login"
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: '#4285f4',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '500'
          }}
        >
          Entrar
        </Link>

        <Link
          to="/demo/patient/timeline"
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: 'transparent',
            color: '#4285f4',
            textDecoration: 'none',
            border: '2px solid #4285f4',
            borderRadius: '8px',
            fontWeight: '500'
          }}
        >
          Ver Demo
        </Link>
      </div>

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        maxWidth: '500px'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Como funciona:</h3>
        <ul style={{
          textAlign: 'left',
          lineHeight: '1.8',
          color: '#555'
        }}>
          <li>📸 Registre suas refeições com fotos</li>
          <li>👨‍⚕️ Conecte-se com nutricionistas</li>
          <li>📊 Receba avaliações personalizadas</li>
          <li>📈 Acompanhe seu progresso</li>
        </ul>
      </div>
    </div>
  );
}
