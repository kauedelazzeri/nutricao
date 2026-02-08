import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useNutritionists } from '~/shared/hooks/useNutritionists';
import { useCreateEvaluation } from '~/shared/hooks/useEvaluations';

export default function RequestEvaluationPage() {
  const { nutritionistId } = useParams();
  const navigate = useNavigate();
  const { data: nutritionists } = useNutritionists();
  const createEvaluation = useCreateEvaluation();

  const nutritionist = nutritionists?.find(n => n.id === nutritionistId);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert('Por favor, preencha ambas as datas');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('A data inicial deve ser anterior à data final');
      return;
    }

    if (!nutritionistId) {
      alert('Nutricionista não encontrado');
      return;
    }

    try {
      await createEvaluation.mutateAsync({
        nutritionist_id: nutritionistId,
        period_start: startDate,
        period_end: endDate
      });

      navigate('/app/patient/my-evaluations');
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  if (!nutritionist) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p>Nutricionista não encontrado</p>
        <button
          onClick={() => navigate('/app/patient/nutritionists')}
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
          Ver nutricionistas
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <button
        onClick={() => navigate('/app/patient/nutritionists')}
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
        marginBottom: '1.5rem',
        color: '#333'
      }}>
        Solicitar Avaliação
      </h1>

      {/* Nutritionist Info */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
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

        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <p style={{
              margin: 0,
              fontSize: '0.95rem',
              fontWeight: '500',
              color: '#9ca3af',
              textDecoration: 'line-through'
            }}>
              R$ {nutritionist.consultation_fee.toFixed(2)}
            </p>
            <p style={{
              margin: 0,
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#4caf50'
            }}>
              GRÁTIS
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.3rem',
          marginBottom: '1rem',
          color: '#333'
        }}>
          Período para Avaliação
        </h2>

        <p style={{
          color: '#666',
          fontSize: '0.95rem',
          marginBottom: '1.5rem',
          lineHeight: '1.5'
        }}>
          Selecione o período das refeições que você deseja que o nutricionista analise.
          Todas as suas refeições e seu perfil de saúde desse período serão compartilhados.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333'
          }}>
            Data Inicial
          </label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333'
          }}>
            Data Final
          </label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <button
            type="button"
            onClick={() => navigate('/app/patient/nutritionists')}
            style={{
              flex: 1,
              padding: '0.75rem',
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
            type="submit"
            disabled={createEvaluation.isPending}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: createEvaluation.isPending ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: createEvaluation.isPending ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {createEvaluation.isPending ? 'Enviando...' : 'Solicitar Avaliação'}
          </button>
        </div>
      </form>
    </div>
  );
}
