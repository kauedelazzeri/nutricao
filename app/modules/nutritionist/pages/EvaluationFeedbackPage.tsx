import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAcceptedEvaluation, useUpdateFeedback, useCompleteFeedback } from '~/shared/hooks/useEvaluationFeedback';

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Café da manhã',
  morning_snack: 'Lanche da manhã',
  lunch: 'Almoço',
  afternoon_snack: 'Lanche da tarde',
  dinner: 'Jantar',
  supper: 'Ceia'
};

export default function EvaluationFeedbackPage() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const { data: evaluation, isLoading } = useAcceptedEvaluation(evaluationId!);
  const updateFeedback = useUpdateFeedback();
  const completeFeedback = useCompleteFeedback();

  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Carregar feedback existente quando a avaliação for carregada
  useState(() => {
    if (evaluation?.feedback) {
      setFeedback(evaluation.feedback);
    }
  });

  const handleSaveDraft = async () => {
    if (!evaluationId || !feedback.trim()) {
      alert('Digite um parecer antes de salvar');
      return;
    }

    setIsSaving(true);
    try {
      await updateFeedback.mutateAsync({ evaluationId, feedback });
      alert('Rascunho salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar rascunho. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!evaluationId || !feedback.trim()) {
      alert('Digite um parecer antes de finalizar');
      return;
    }

    if (!confirm('Deseja finalizar esta avaliação? O paciente receberá o parecer e não será mais possível editá-lo.')) {
      return;
    }

    setIsSaving(true);
    try {
      await completeFeedback.mutateAsync({ evaluationId, feedback });
      alert('Avaliação finalizada com sucesso!');
      navigate('/app/nutritionist/dashboard');
    } catch (error) {
      alert('Erro ao finalizar avaliação. Tente novamente.');
    } finally {
      setIsSaving(false);
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
        <p>Carregando avaliação...</p>
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
  const isCompleted = evaluation.status === 'completed';

  // Calcular IMC
  let imc = null;
  if (evaluation.health_snapshot?.weight && evaluation.health_snapshot?.height) {
    const heightInMeters = evaluation.health_snapshot.height / 100;
    imc = (evaluation.health_snapshot.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }

  return (
    <div style={{
      maxWidth: '1400px',
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

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          margin: 0,
          color: '#333'
        }}>
          Avaliação Nutricional
        </h1>

        {isCompleted && (
          <span style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4caf50',
            color: 'white',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            ✓ Finalizada
          </span>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '1.5rem'
      }}>
        {/* Coluna Principal - Refeições */}
        <div>
          {/* Info do Paciente */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
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
              display: 'flex',
              gap: '2rem',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                  📅 Período
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#333', fontWeight: '500' }}>
                  {periodStart} - {periodEnd}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                  🍽️ Refeições
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#333', fontWeight: '500' }}>
                  {evaluation.meals.length} registradas
                </p>
              </div>
            </div>
          </div>

          {/* Refeições - Timeline */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.3rem',
              marginBottom: '1.5rem',
              color: '#333'
            }}>
              🍽️ Refeições do Período
            </h2>

            {evaluation.meals.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                Nenhuma refeição registrada neste período
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {evaluation.meals.map((meal: any) => {
                  const mealDate = new Date(meal.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long'
                  });

                  return (
                    <div
                      key={meal.id}
                      style={{
                        border: '1px solid #e5e5e5',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                    >
                      {meal.photo_url && (
                        <img
                          src={meal.photo_url}
                          alt="Refeição"
                          style={{
                            width: '100%',
                            maxHeight: '400px',
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => window.open(meal.photo_url, '_blank')}
                        />
                      )}
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <span style={{
                              padding: '0.4rem 0.75rem',
                              backgroundColor: '#e3f2fd',
                              color: '#1565c0',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}>
                              {MEAL_TYPE_LABELS[meal.meal_type] || meal.meal_type}
                            </span>
                            <span style={{
                              fontSize: '1rem',
                              color: '#333',
                              fontWeight: '500'
                            }}>
                              {meal.time}
                            </span>
                          </div>
                        </div>
                        <p style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: '0.9rem',
                          color: '#666',
                          textTransform: 'capitalize'
                        }}>
                          {mealDate}
                        </p>
                        {meal.description && (
                          <p style={{
                            margin: 0,
                            fontSize: '1rem',
                            color: '#333',
                            lineHeight: '1.5'
                          }}>
                            {meal.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Perfil de Saúde + Parecer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Perfil de Saúde */}
          {evaluation.health_snapshot && (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                marginBottom: '1rem',
                color: '#333'
              }}>
                🏃 Perfil de Saúde
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {evaluation.health_snapshot.age && (
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#666' }}>Idade</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>
                      {evaluation.health_snapshot.age} anos
                    </p>
                  </div>
                )}
                {evaluation.health_snapshot.weight && (
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#666' }}>Peso</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>
                      {evaluation.health_snapshot.weight} kg
                    </p>
                  </div>
                )}
                {evaluation.health_snapshot.height && (
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#666' }}>Altura</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>
                      {evaluation.health_snapshot.height} cm
                    </p>
                  </div>
                )}
                {imc && (
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#666' }}>IMC</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>
                      {imc}
                    </p>
                  </div>
                )}
              </div>

              {evaluation.health_snapshot.activity_level && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>
                    Nível de Atividade
                  </p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    {evaluation.health_snapshot.activity_level === 'sedentary' && 'Sedentário'}
                    {evaluation.health_snapshot.activity_level === 'light' && 'Leve'}
                    {evaluation.health_snapshot.activity_level === 'moderate' && 'Moderado'}
                    {evaluation.health_snapshot.activity_level === 'active' && 'Ativo'}
                    {evaluation.health_snapshot.activity_level === 'very_active' && 'Muito Ativo'}
                  </span>
                </div>
              )}

              {evaluation.health_snapshot.health_goals && evaluation.health_snapshot.health_goals.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>
                    Objetivos
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {evaluation.health_snapshot.health_goals.map((goal: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#e8f5e9',
                          color: '#2e7d32',
                          borderRadius: '12px',
                          fontSize: '0.75rem'
                        }}
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {evaluation.health_snapshot.dietary_restrictions && evaluation.health_snapshot.dietary_restrictions.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>
                    Restrições
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {evaluation.health_snapshot.dietary_restrictions.map((restriction: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#fff3e0',
                          color: '#e65100',
                          borderRadius: '12px',
                          fontSize: '0.75rem'
                        }}
                      >
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {evaluation.health_snapshot.allergies && evaluation.health_snapshot.allergies.length > 0 && (
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>
                    Alergias
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {evaluation.health_snapshot.allergies.map((allergy: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#ffebee',
                          color: '#c62828',
                          borderRadius: '12px',
                          fontSize: '0.75rem'
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

          {/* Parecer Nutricional */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: '#333'
            }}>
              📝 Parecer Nutricional
            </h2>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isCompleted}
              placeholder="Digite aqui sua avaliação nutricional completa para o paciente...

Você pode incluir:
- Análise dos hábitos alimentares
- Pontos positivos identificados
- Sugestões de melhoria
- Recomendações nutricionais específicas
- Próximos passos"
              style={{
                width: '100%',
                minHeight: '300px',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: '1.6',
                resize: 'vertical',
                fontFamily: 'inherit',
                backgroundColor: isCompleted ? '#f5f5f5' : 'white',
                cursor: isCompleted ? 'not-allowed' : 'text'
              }}
            />

            {!isCompleted && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: '1rem'
              }}>
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving || !feedback.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSaving || !feedback.trim() ? '#ccc' : 'transparent',
                    color: isSaving || !feedback.trim() ? '#666' : '#2196f3',
                    border: '2px solid',
                    borderColor: isSaving || !feedback.trim() ? '#ccc' : '#2196f3',
                    borderRadius: '8px',
                    cursor: isSaving || !feedback.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  {isSaving ? 'Salvando...' : '💾 Salvar Rascunho'}
                </button>

                <button
                  onClick={handleComplete}
                  disabled={isSaving || !feedback.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSaving || !feedback.trim() ? '#ccc' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isSaving || !feedback.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  {isSaving ? 'Finalizando...' : '✓ Finalizar Avaliação'}
                </button>
              </div>
            )}

            {isCompleted && (
              <p style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                borderRadius: '6px',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ✓ Avaliação finalizada e enviada ao paciente
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
