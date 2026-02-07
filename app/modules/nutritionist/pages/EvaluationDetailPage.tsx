import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useEvaluationDetails, useAcceptEvaluation, useRejectEvaluation } from '~/shared/hooks/useEvaluationActions';

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Café da manhã',
  morning_snack: 'Lanche da manhã',
  lunch: 'Almoço',
  afternoon_snack: 'Lanche da tarde',
  dinner: 'Jantar',
  supper: 'Ceia'
};

export default function EvaluationDetailPage() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const { data: evaluation, isLoading } = useEvaluationDetails(evaluationId!);
  const acceptEvaluation = useAcceptEvaluation();
  const rejectEvaluation = useRejectEvaluation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleAccept = async () => {
    if (!evaluationId) return;

    if (confirm('Deseja aceitar esta solicitação de avaliação?')) {
      try {
        await acceptEvaluation.mutateAsync(evaluationId);
        navigate(`/app/nutritionist/feedback/${evaluationId}`);
      } catch (error) {
        alert('Erro ao aceitar avaliação. Tente novamente.');
      }
    }
  };

  const handleReject = async () => {
    if (!evaluationId || !rejectionReason.trim()) {
      alert('Por favor, informe o motivo da rejeição');
      return;
    }

    try {
      await rejectEvaluation.mutateAsync({
        evaluationId,
        reason: rejectionReason
      });
      alert('Avaliação rejeitada');
      navigate('/app/nutritionist/dashboard');
    } catch (error) {
      alert('Erro ao rejeitar avaliação. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p>Avaliação não encontrada</p>
        <button
          onClick={() => navigate('/app/nutritionist/dashboard')}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const periodStart = new Date(evaluation.period_start).toLocaleDateString('pt-BR');
  const periodEnd = new Date(evaluation.period_end).toLocaleDateString('pt-BR');
  const createdAt = new Date(evaluation.created_at).toLocaleDateString('pt-BR');

  const isPending = evaluation.status === 'pending';
  const isAccepted = evaluation.status === 'accepted';

  // Calcular IMC se tiver dados
  let imc = null;
  if (evaluation.health_snapshot?.weight && evaluation.health_snapshot?.height) {
    const heightInMeters = evaluation.health_snapshot.height / 100;
    imc = (evaluation.health_snapshot.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <button
        onClick={() => navigate('/app/nutritionist/dashboard')}
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
        marginBottom: '2rem',
        color: '#333'
      }}>
        Solicitação de Avaliação
      </h1>

      {/* Informações do Paciente */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.3rem',
          marginBottom: '1rem',
          color: '#333'
        }}>
          👤 Paciente
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {evaluation.patient_avatar ? (
            <img
              src={evaluation.patient_avatar}
              alt={evaluation.patient_name}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem'
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
              margin: '0.25rem 0 0 0',
              color: '#666',
              fontSize: '0.95rem'
            }}>
              {evaluation.patient_email}
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
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
              {evaluation.meals.length} registradas
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

      {/* Perfil de Saúde */}
      {evaluation.health_snapshot && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            marginBottom: '1rem',
            color: '#333'
          }}>
            🏃 Perfil de Saúde
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {evaluation.health_snapshot.age && (
              <div>
                <p style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  Idade
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {evaluation.health_snapshot.age} anos
                </p>
              </div>
            )}

            {evaluation.health_snapshot.weight && (
              <div>
                <p style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  Peso
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {evaluation.health_snapshot.weight} kg
                </p>
              </div>
            )}

            {evaluation.health_snapshot.height && (
              <div>
                <p style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  Altura
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {evaluation.health_snapshot.height} cm
                </p>
              </div>
            )}

            {imc && (
              <div>
                <p style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  IMC
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {imc}
                </p>
              </div>
            )}

            {evaluation.health_snapshot.activity_level && (
              <div>
                <p style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  Nível de Atividade
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {evaluation.health_snapshot.activity_level === 'sedentary' && 'Sedentário'}
                  {evaluation.health_snapshot.activity_level === 'light' && 'Leve'}
                  {evaluation.health_snapshot.activity_level === 'moderate' && 'Moderado'}
                  {evaluation.health_snapshot.activity_level === 'active' && 'Ativo'}
                  {evaluation.health_snapshot.activity_level === 'very_active' && 'Muito Ativo'}
                </p>
              </div>
            )}
          </div>

          {evaluation.health_snapshot.health_goals && evaluation.health_snapshot.health_goals.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{
                margin: '0 0 0.5rem 0',
                fontSize: '0.85rem',
                color: '#666',
                fontWeight: '600'
              }}>
                Objetivos de Saúde
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {evaluation.health_snapshot.health_goals.map((goal: string, idx: number) => (
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
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {evaluation.health_snapshot.dietary_restrictions && evaluation.health_snapshot.dietary_restrictions.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{
                margin: '0 0 0.5rem 0',
                fontSize: '0.85rem',
                color: '#666',
                fontWeight: '600'
              }}>
                Restrições Alimentares
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {evaluation.health_snapshot.dietary_restrictions.map((restriction: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#fff3e0',
                      color: '#e65100',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}

          {evaluation.health_snapshot.allergies && evaluation.health_snapshot.allergies.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{
                margin: '0 0 0.5rem 0',
                fontSize: '0.85rem',
                color: '#666',
                fontWeight: '600'
              }}>
                Alergias
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {evaluation.health_snapshot.allergies.map((allergy: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#ffebee',
                      color: '#c62828',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refeições */}
      {evaluation.meals.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            marginBottom: '1rem',
            color: '#333'
          }}>
            🍽️ Refeições Registradas ({evaluation.meals.length})
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {evaluation.meals.map((meal: any) => {
              const mealDate = new Date(meal.date).toLocaleDateString('pt-BR');
              
              return (
                <div
                  key={meal.id}
                  style={{
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  {meal.photo_url && (
                    <img
                      src={meal.photo_url}
                      alt="Refeição"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div style={{ padding: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {MEAL_TYPE_LABELS[meal.meal_type] || meal.meal_type}
                      </span>
                      <span style={{
                        fontSize: '0.85rem',
                        color: '#666'
                      }}>
                        {meal.time}
                      </span>
                    </div>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '0.85rem',
                      color: '#999'
                    }}>
                      {mealDate}
                    </p>
                    {meal.description && (
                      <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        color: '#666',
                        lineHeight: '1.4'
                      }}>
                        {meal.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      {isPending && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => setShowRejectModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#f44336',
              border: '2px solid #f44336',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            ✕ Rejeitar
          </button>

          <button
            onClick={handleAccept}
            disabled={acceptEvaluation.isPending}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: acceptEvaluation.isPending ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: acceptEvaluation.isPending ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {acceptEvaluation.isPending ? 'Aceitando...' : '✓ Aceitar Avaliação'}
          </button>
        </div>
      )}

      {/* Modal de Rejeição */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.3rem'
            }}>
              Rejeitar Avaliação
            </h3>
            <p style={{
              margin: '0 0 1rem 0',
              color: '#666'
            }}>
              Por favor, informe o motivo da rejeição:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Não trabalho com esse tipo de objetivo, período muito curto de avaliação, etc."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.5rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={rejectEvaluation.isPending || !rejectionReason.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: rejectEvaluation.isPending || !rejectionReason.trim() ? '#ccc' : '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: rejectEvaluation.isPending || !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {rejectEvaluation.isPending ? 'Rejeitando...' : 'Confirmar Rejeição'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
