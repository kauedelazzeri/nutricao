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
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Carregando avaliações...</p>
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
          Erro ao carregar avaliações
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

  if (!evaluations || evaluations.length === 0) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Nenhuma avaliação</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Você ainda não solicitou nenhuma avaliação
        </p>
        <button
          onClick={() => navigate('/app/patient/nutritionists')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Solicitar Avaliação
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <button
        onClick={() => navigate('/app/patient/timeline')}
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

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
            color: '#333'
          }}>
            Minhas Avaliações
          </h1>
          <p style={{
            color: '#666'
          }}>
            Acompanhe o status das suas solicitações
          </p>
        </div>

        <button
          onClick={() => navigate('/app/patient/nutritionists')}
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
          + Nova Avaliação
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
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
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '1.5rem'
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
