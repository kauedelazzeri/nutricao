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
                  onClick={() => navigate(`/app/nutritionist/feedback/${evaluation.id}`)}
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

                  <p style={{
                    margin: '0.75rem 0 0 0',
                    fontSize: '0.85rem',
                    color: evaluation.feedback ? '#4caf50' : '#ff9800',
                    fontWeight: '500'
                  }}>
                    {evaluation.feedback ? '✓ Parecer salvo' : '⚠️ Aguardando parecer'}
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

      {/* Histórico Completo */}
      {(allEvaluations && allEvaluations.length > 0) && (
        <>
          <h2 style={{
            fontSize: '1.5rem',
            marginTop: '3rem',
            marginBottom: '1rem',
            color: '#333'
          }}>
            📊 Histórico Completo
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {allEvaluations.map(evaluation => {
              const status = STATUS_MAP[evaluation.status as keyof typeof STATUS_MAP];
              const startDate = new Date(evaluation.period_start);
              const endDate = new Date(evaluation.period_end);
              const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={evaluation.id}
                  onClick={() => {
                    if (evaluation.status === 'pending') {
                      navigate(`/app/nutritionist/evaluation/${evaluation.id}`);
                    } else if (evaluation.status === 'accepted') {
                      navigate(`/app/nutritionist/feedback/${evaluation.id}`);
                    }
                  }}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: evaluation.status !== 'completed' ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    opacity: evaluation.status === 'rejected' ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (evaluation.status !== 'completed' && evaluation.status !== 'rejected') {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#d1fae5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        {evaluation.patient_avatar ? (
                          <img 
                            src={evaluation.patient_avatar} 
                            alt={evaluation.patient_name}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : '👤'}
                      </div>
                      <div>
                        <p style={{ 
                          fontWeight: '600', 
                          margin: 0,
                          fontSize: '0.95rem'
                        }}>
                          {evaluation.patient_name}
                        </p>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          color: '#666',
                          margin: '0.15rem 0 0 0'
                        }}>
                          {days} dias • {startDate.toLocaleDateString('pt-BR')} - {endDate.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: `${status?.color}22`,
                      color: status?.color
                    }}>
                      {status?.label}
                    </span>
                  </div>

                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#999',
                    margin: 0
                  }}>
                    Criado em {new Date(evaluation.created_at).toLocaleDateString('pt-BR')} às {new Date(evaluation.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    {evaluation.completed_at && ` • Concluído em ${new Date(evaluation.completed_at).toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
