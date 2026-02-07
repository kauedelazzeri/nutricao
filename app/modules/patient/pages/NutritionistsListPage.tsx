import { useNavigate } from 'react-router';
import { useNutritionists } from '~/shared/hooks/useNutritionists';

export default function NutritionistsListPage() {
  const navigate = useNavigate();
  const { data: nutritionists, isLoading, error } = useNutritionists();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Carregando nutricionistas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#f44336', marginBottom: '1rem' }}>
          Erro ao carregar nutricionistas
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!nutritionists || nutritionists.length === 0) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Nenhum nutricionista disponível</h2>
        <p style={{ color: '#666' }}>
          Não há nutricionistas cadastrados no momento
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginBottom: '1.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.95rem'
        }}
      >
        ← Voltar
      </button>

      <h1 style={{
        fontSize: '2rem',
        marginBottom: '0.5rem',
        color: '#333'
      }}>
        Nutricionistas Disponíveis
      </h1>
      <p style={{
        color: '#666',
        marginBottom: '2rem'
      }}>
        Escolha um nutricionista para solicitar uma avaliação
      </p>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {nutritionists.map(nutritionist => (
          <div
            key={nutritionist.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                flexShrink: 0
              }}>
                {nutritionist.avatar_url ? (
                  <img
                    src={nutritionist.avatar_url}
                    alt={nutritionist.full_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  '👨‍⚕️'
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.2rem',
                  color: '#333'
                }}>
                  {nutritionist.full_name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.25rem'
                }}>
                  <span style={{
                    color: '#ffa726',
                    fontSize: '0.9rem'
                  }}>
                    ⭐ {nutritionist.rating.toFixed(1)}
                  </span>
                  <span style={{
                    color: '#999',
                    fontSize: '0.85rem'
                  }}>
                    ({nutritionist.total_evaluations} avaliações)
                  </span>
                </div>
              </div>
            </div>

            {nutritionist.bio && (
              <p style={{
                margin: 0,
                color: '#666',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                {nutritionist.bio}
              </p>
            )}

            {nutritionist.specialties && nutritionist.specialties.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {nutritionist.specialties.map((specialty: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #f0f0f0'
            }}>
              <div>
                {nutritionist.years_experience && (
                  <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>
                    {nutritionist.years_experience} anos de experiência
                  </p>
                )}
                <p style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#4caf50'
                }}>
                  R$ {nutritionist.consultation_fee.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => navigate(`/app/patient/request-evaluation/${nutritionist.id}`)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
              >
                Solicitar Avaliação
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
