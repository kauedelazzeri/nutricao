import { useNavigate } from 'react-router';
import { useNutritionists } from '~/shared/hooks/useNutritionists';

export default function NutritionistsListPage() {
  const navigate = useNavigate();
  const { data: nutritionists, isLoading, error } = useNutritionists();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        gap: '1rem'
      }}>
        <div style={{
          fontSize: '3rem'
        }}>👩‍⚕️</div>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #d1fae5',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Carregando nutricionistas...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>😕</div>
        <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Ops! Algo deu errado</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Não foi possível carregar os nutricionistas
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
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
        <div style={{
          fontSize: '5rem',
          marginBottom: '1.5rem'
        }}>👩‍⚕️</div>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.75rem'
        }}>Nenhum nutricionista disponível</h2>
        <p style={{
          color: '#6b7280',
          fontSize: '1.05rem'
        }}>
          Não há nutricionistas cadastrados no momento
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: 'clamp(1rem, 3vw, 1.5rem)',
      paddingBottom: '6rem',
      background: 'linear-gradient(to bottom, #f0fdf4 0%, #ffffff 300px)'
    }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.5rem'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: '700',
            color: '#1f2937',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Nutricionistas Disponíveis
          </h1>
          <span style={{
            padding: '0.4rem 0.9rem',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            🎉 Promoção
          </span>
        </div>
        <p style={{
          margin: 0,
          color: '#6b7280',
          fontSize: '0.95rem'
        }}>
          <strong style={{ color: '#10b981' }}>Avaliações gratuitas por tempo limitado!</strong> Escolha um nutricionista
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {nutritionists.map(nutritionist => (
          <div
            key={nutritionist.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.15)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0,
                border: '2px solid #10b981'
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  color: '#1f2937',
                  fontWeight: '700',
                  wordBreak: 'break-word'
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
                    color: '#fbbf24',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    ⭐ {nutritionist.rating.toFixed(1)}
                  </span>
                  <span style={{
                    color: '#6b7280',
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
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6'
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
                      padding: '0.35rem 0.85rem',
                      backgroundColor: '#d1fae5',
                      color: '#059669',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      letterSpacing: '0.02em'
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
              borderTop: '1px solid #f3f4f6'
            }}>
              <div>
                {nutritionist.years_experience && (
                  <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {nutritionist.years_experience} anos de experiência
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '0.25rem'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#9ca3af',
                    textDecoration: 'line-through'
                  }}>
                    R$ {nutritionist.consultation_fee.toFixed(2)}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#10b981'
                  }}>
                    GRÁTIS
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/app/patient/request-evaluation/${nutritionist.id}`)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Solicitar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
