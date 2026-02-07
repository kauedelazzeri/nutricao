import { useNavigate } from 'react-router';
import { useMyEvaluations } from '~/shared/hooks/useEvaluations';

const STATUS_MAP = {
  pending: { label: 'Pendente', color: '#ff9800' },
  accepted: { label: 'Aceito', color: '#2196f3' },
  rejected: { label: 'Rejeitado', color: '#f44336' },
  completed: { label: 'Concluído', color: '#4caf50' }
};

export default function MyEvaluationsPage() {
  const navigate = useNavigate();
  const { data: evaluations, isLoading, error } = useMyEvaluations();

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
        }}>📊</div>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #d1fae5',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Carregando avaliações...</p>
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
          Não foi possível carregar suas avaliações
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

  if (!evaluations || evaluations.length === 0) {
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
        }}>📊</div>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.75rem'
        }}>Solicite sua primeira avaliação!</h2>
        <p style={{
          color: '#6b7280',
          fontSize: '1.05rem',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Conecte-se com nutricionistas profissionais e receba orientações personalizadas
        </p>
        <button
          onClick={() => navigate('/app/patient/nutritionists')}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.05rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}
        >
          👩‍⚕️ Encontrar Nutricionista
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'clamp(1rem, 3vw, 1.5rem)',
      paddingBottom: '6rem',
      background: 'linear-gradient(to bottom, #f0fdf4 0%, #ffffff 300px)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
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
            Minhas Avaliações
          </h1>
          <p style={{
            margin: '0.25rem 0 0 0',
            color: '#6b7280',
            fontSize: '0.95rem'
          }}>
            Acompanhe o status das suas solicitações
          </p>
        </div>

        <button
          onClick={() => navigate('/app/patient/nutritionists')}
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
            whiteSpace: 'nowrap'
          }}
        >
          + Nova
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {evaluations.map(evaluation => {
          const status = STATUS_MAP[evaluation.status as keyof typeof STATUS_MAP] || STATUS_MAP.pending;
          const periodStart = new Date(evaluation.period_start).toLocaleDateString('pt-BR');
          const periodEnd = new Date(evaluation.period_end).toLocaleDateString('pt-BR');
          const createdAt = new Date(evaluation.created_at).toLocaleDateString('pt-BR');

          return (
            <div
              key={evaluation.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.2rem',
                      color: '#333'
                    }}>
                      {evaluation.nutritionist_name}
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: `${status.color}20`,
                      color: status.color,
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      {status.label}
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    Solicitada em {createdAt}
                  </p>
                </div>

                {evaluation.nutritionist_avatar && (
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img
                      src={evaluation.nutritionist_avatar}
                      alt={evaluation.nutritionist_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>
                    Período
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {periodStart} - {periodEnd}
                  </p>
                </div>

                <div>
                  <p style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>
                    Refeições
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {evaluation.meal_count || 0} refeições
                  </p>
                </div>
              </div>

              {evaluation.feedback && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <p style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '0.85rem',
                    color: '#2e7d32',
                    fontWeight: '600'
                  }}>
                    Parecer do Nutricionista
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#333',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    {evaluation.feedback}
                  </p>
                </div>
              )}

              {evaluation.status === 'rejected' && evaluation.rejection_reason && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#ffebee',
                  borderRadius: '8px'
                }}>
                  <p style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '0.85rem',
                    color: '#c62828',
                    fontWeight: '600'
                  }}>
                    Motivo da Rejeição
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#333',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    {evaluation.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
