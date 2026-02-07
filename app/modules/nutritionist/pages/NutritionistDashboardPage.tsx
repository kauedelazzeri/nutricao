import { useNavigate } from 'react-router';
import { useNutritionistEvaluations } from '~/shared/hooks/useNutritionistEvaluations';

const STATUS_MAP = {
  pending: { label: 'Pendente', color: '#ff9800' },
  accepted: { label: 'Aceito', color: '#2196f3' },
  rejected: { label: 'Rejeitado', color: '#f44336' },
  completed: { label: 'Concluído', color: '#4caf50' }
};

export default function NutritionistDashboardPage() {
  const navigate = useNavigate();
  const { data: allEvaluations, isLoading } = useNutritionistEvaluations();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Carregando...</p>
      </div>
    );
  }

  // Filtrar por status em memória
  const allPending = (allEvaluations || []).filter(e => e.status === 'pending');
  const allAccepted = (allEvaluations || []).filter(e => e.status === 'accepted');
  const allCompleted = (allEvaluations || []).filter(e => e.status === 'completed');

  return (
    <div style={{
      maxWidth: '1200px',
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
        Painel do Nutricionista
      </h1>
      <p style={{
        color: '#666',
        marginBottom: '2rem'
      }}>
        Gerencie suas avaliações nutricionais
      </p>

      {/* Estatísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#fff3e0',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #ffe0b2'
        }}>
          <p style={{
            fontSize: '0.85rem',
            color: '#e65100',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Pendentes
          </p>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#ff9800',
            margin: 0
          }}>
            {allPending.length}
          </p>
        </div>

        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #bbdefb'
        }}>
          <p style={{
            fontSize: '0.85rem',
            color: '#0d47a1',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Em Andamento
          </p>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#2196f3',
            margin: 0
          }}>
            {allAccepted.length}
          </p>
        </div>

        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #c8e6c9'
        }}>
          <p style={{
            fontSize: '0.85rem',
            color: '#1b5e20',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Concluídas
          </p>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#4caf50',
            margin: 0
          }}>
            {allCompleted.length}
          </p>
        </div>
      </div>

      {/* Avaliações Pendentes */}
      {allPending.length > 0 && (
        <>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#333'
          }}>
            ⏳ Aguardando Sua Resposta
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {allPending.map(evaluation => {
              const periodStart = new Date(evaluation.period_start).toLocaleDateString('pt-BR');
              const periodEnd = new Date(evaluation.period_end).toLocaleDateString('pt-BR');
              const createdAt = new Date(evaluation.created_at).toLocaleDateString('pt-BR');

              return (
                <div
                  key={evaluation.id}
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid #ff9800',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => navigate(`/app/nutritionist/evaluation/${evaluation.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
                        {evaluation.patient_avatar ? (
                          <img
                            src={evaluation.patient_avatar}
                            alt={evaluation.patient_name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#e3f2fd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}>
                            👤
                          </div>
                        )}
                        <div>
                          <h3 style={{
                            margin: 0,
                            fontSize: '1.2rem',
                            color: '#333'
                          }}>
                            {evaluation.patient_name}
                          </h3>
                          <p style={{
                            margin: 0,
                            color: '#666',
                            fontSize: '0.85rem'
                          }}>
                            {evaluation.patient_email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#fff3e0',
                      color: '#ff9800',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      Nova Solicitação
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <p style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.85rem',
                        color: '#666'
                      }}>
                        📅 Período
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
                        🍽️ Refeições
                      </p>
                      <p style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        {evaluation.meal_count} registradas
                      </p>
                    </div>

                    <div>
                      <p style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.85rem',
                        color: '#666'
                      }}>
                        📨 Solicitada em
                      </p>
                      <p style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        {createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Avaliações Em Andamento */}
      {allAccepted.length > 0 && (
        <>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#333'
          }}>
            📝 Em Andamento
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {allAccepted.map(evaluation => {
              const periodStart = new Date(evaluation.period_start).toLocaleDateString('pt-BR');
              const periodEnd = new Date(evaluation.period_end).toLocaleDateString('pt-BR');

              return (
                <div
                  key={evaluation.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/app/nutritionist/evaluation/${evaluation.id}`)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    {evaluation.patient_avatar ? (
                      <img
                        src={evaluation.patient_avatar}
                        alt={evaluation.patient_name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#e3f2fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        👤
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        color: '#333'
                      }}>
                        {evaluation.patient_name}
                      </h3>
                      <p style={{
                        margin: 0,
                        color: '#666',
                        fontSize: '0.85rem'
                      }}>
                        {evaluation.meal_count} refeições
                      </p>
                    </div>
                  </div>

                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    {periodStart} - {periodEnd}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Estado vazio */}
      {allPending.length === 0 && allAccepted.length === 0 && allCompleted.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Nenhuma avaliação ainda</h3>
          <p style={{ color: '#666' }}>
            Quando pacientes solicitarem avaliações, elas aparecerão aqui
          </p>
        </div>
      )}
    </div>
  );
}
