import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMeals, useUpdateMeal } from '~/shared/hooks/useMeals';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Café da manhã' },
  { value: 'morning_snack', label: 'Lanche da manhã' },
  { value: 'lunch', label: 'Almoço' },
  { value: 'afternoon_snack', label: 'Lanche da tarde' },
  { value: 'dinner', label: 'Jantar' },
  { value: 'supper', label: 'Ceia' }
] as const;

export default function EditMealPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: meals } = useMeals();
  const updateMeal = useUpdateMeal();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mealType, setMealType] = useState<string>('lunch');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !meals) return;

    const meal = meals.find(m => m.id === id);
    if (!meal) {
      alert('Refeição não encontrada');
      navigate('/app/patient/timeline');
      return;
    }

    setDate(meal.date);
    setTime(meal.time);
    setMealType(meal.meal_type);
    setDescription(meal.description);
    setCurrentPhotoUrl(meal.photo_url || null);
    setLoading(false);
  }, [id, meals, navigate]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleRemoveCurrentPhoto = () => {
    setCurrentPhotoUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      await updateMeal.mutateAsync({
        id,
        updates: {
          date,
          time,
          meal_type: mealType as any,
          description: description.trim() || '',
          photo: photo || undefined,
          // Se removeu a foto atual e não adicionou nova, limpar URLs
          photo_url: !currentPhotoUrl && !photo ? null : undefined,
          photo_public_id: !currentPhotoUrl && !photo ? null : undefined,
        }
      });

      alert('Refeição atualizada com sucesso!');
      navigate('/app/patient/timeline');
    } catch (error: any) {
      console.error('Error updating meal:', error);
      const errorMessage = error?.message || 'Erro ao atualizar refeição';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <p>Carregando...</p>
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

      <h1 style={{
        fontSize: '1.8rem',
        marginBottom: '1.5rem',
        color: '#333'
      }}>
        Editar Refeição
      </h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#555'
          }}>
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#555'
          }}>
            Hora
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
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

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#555'
          }}>
            Tipo de Refeição
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            {MEAL_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#555'
          }}>
            Descrição (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Descreva sua refeição..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'inherit'
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
            Foto (opcional)
          </label>

          {/* Foto atual */}
          {currentPhotoUrl && !photoPreview && (
            <div style={{
              position: 'relative',
              marginBottom: '1rem'
            }}>
              <img
                src={currentPhotoUrl}
                alt="Foto atual"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #4caf50'
                }}
              />
              <button
                type="button"
                onClick={handleRemoveCurrentPhoto}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: '#4caf50'
              }}>
                ✓ Foto atual (mantenha ou adicione uma nova abaixo)
              </p>
            </div>
          )}

          {/* Preview da nova foto */}
          {photoPreview && (
            <div style={{
              position: 'relative',
              marginBottom: '1rem'
            }}>
              <img
                src={photoPreview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #2196f3'
                }}
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: '#2196f3'
              }}>
                ✓ Nova foto (substituirá a atual)
              </p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          {!currentPhotoUrl && !photoPreview && (
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.85rem',
              color: '#666'
            }}>
              Nenhuma foto selecionada
            </p>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <button
            type="button"
            onClick={() => navigate('/app/patient/timeline')}
            style={{
              flex: 1,
              padding: '0.875rem',
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={updateMeal.isPending}
            style={{
              flex: 1,
              padding: '0.875rem',
              backgroundColor: updateMeal.isPending ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: updateMeal.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {updateMeal.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
