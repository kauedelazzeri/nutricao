import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useHealthProfile, useSaveHealthProfile } from '~/shared/hooks/useHealthProfile';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentário (pouco ou nenhum exercício)' },
  { value: 'light', label: 'Levemente ativo (1-3 dias/semana)' },
  { value: 'moderate', label: 'Moderadamente ativo (3-5 dias/semana)' },
  { value: 'very', label: 'Muito ativo (6-7 dias/semana)' },
  { value: 'extra', label: 'Extremamente ativo (atleta/trabalho físico)' }
];

export default function PatientHealthProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useHealthProfile();
  const saveProfile = useSaveHealthProfile();

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [healthGoals, setHealthGoals] = useState('');
  const [allergies, setAllergies] = useState('');

  useEffect(() => {
    if (profile) {
      setAge(profile.age?.toString() || '');
      setWeight(profile.weight?.toString() || '');
      setHeight(profile.height?.toString() || '');
      setActivityLevel(profile.activity_level || '');
      setDietaryRestrictions(profile.dietary_restrictions?.join(', ') || '');
      setHealthGoals(profile.health_goals?.join(', ') || '');
      setAllergies(profile.allergies?.join(', ') || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await saveProfile.mutateAsync({
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        activity_level: activityLevel || null,
        dietary_restrictions: dietaryRestrictions
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        health_goals: healthGoals
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        allergies: allergies
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      });

      alert('Perfil de saúde atualizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving health profile:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
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
        <p>Carregando...</p>
      </div>
    );
  }

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : null;

  return (
    <div style={{
      maxWidth: '700px',
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
        Perfil de Saúde
      </h1>
      <p style={{
        color: '#666',
        marginBottom: '2rem'
      }}>
        Mantenha suas informações atualizadas para avaliações mais precisas
      </p>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem'
      }}>
        {/* Dados Básicos */}
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '12px'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            marginBottom: '1.25rem',
            color: '#333'
          }}>
            Dados Básicos
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#555'
              }}>
                Idade
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 25"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#555'
              }}>
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 70.5"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#555'
              }}>
                Altura (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 175"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {bmi && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.95rem',
                color: '#1976d2'
              }}>
                💡 IMC calculado: <strong>{bmi}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Atividade Física */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#555'
          }}>
            Nível de Atividade Física
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            <option value="">Selecione...</option>
            {ACTIVITY_LEVELS.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Restrições Alimentares */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#555'
          }}>
            Restrições Alimentares
          </label>
          <input
            type="text"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            placeholder="Ex: Vegetariano, Sem lactose, Low carb (separados por vírgula)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          <p style={{
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            color: '#666'
          }}>
            Separe múltiplas restrições por vírgula
          </p>
        </div>

        {/* Objetivos de Saúde */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#555'
          }}>
            Objetivos de Saúde
          </label>
          <input
            type="text"
            value={healthGoals}
            onChange={(e) => setHealthGoals(e.target.value)}
            placeholder="Ex: Perder peso, Ganhar massa muscular, Melhorar saúde (separados por vírgula)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          <p style={{
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            color: '#666'
          }}>
            Separe múltiplos objetivos por vírgula
          </p>
        </div>

        {/* Alergias */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#555'
          }}>
            Alergias Alimentares
          </label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Ex: Amendoim, Camarão, Glúten (separados por vírgula)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          <p style={{
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            color: '#666'
          }}>
            Separe múltiplas alergias por vírgula
          </p>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saveProfile.isPending}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: saveProfile.isPending ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: saveProfile.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {saveProfile.isPending ? 'Salvando...' : 'Salvar Perfil'}
          </button>
        </div>
      </form>
    </div>
  );
}
