import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAddMeal } from '~/shared/hooks/useMeals';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Café da manhã' },
  { value: 'morning_snack', label: 'Lanche da manhã' },
  { value: 'lunch', label: 'Almoço' },
  { value: 'afternoon_snack', label: 'Lanche da tarde' },
  { value: 'dinner', label: 'Jantar' },
  { value: 'supper', label: 'Ceia' }
] as const;

export default function RegisterMealPage() {
  const navigate = useNavigate();
  const addMeal = useAddMeal();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [mealType, setMealType] = useState<string>('lunch');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('Por favor, descreva a refeição');
      return;
    }

    try {
      await addMeal.mutateAsync({
        date,
        time,
        meal_type: mealType as any,
        description: description.trim(),
        photo: photo || undefined
      });

      alert('Refeição registrada com sucesso!');
      navigate('/app/patient/timeline');
    } catch (error) {
      console.error('Error creating meal:', error);
      alert('Erro ao registrar refeição. Tente novamente.');
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
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
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        ← Voltar
      </button>

      <h1 style={{ marginBottom: '2rem' }}>Registrar Refeição</h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Data */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Data *
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

        {/* Hora */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Hora *
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

        {/* Tipo de refeição */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Tipo de Refeição *
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

        {/* Descrição */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Descrição *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Ex: Arroz, feijão, frango grelhado, salada..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Foto */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Foto (opcional)
          </label>
          
          {photoPreview ? (
            <div style={{
              position: 'relative',
              border: '2px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <img
                src={photoPreview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Remover foto
              </button>
            </div>
          ) : (
            <label style={{
              display: 'block',
              padding: '3rem 1rem',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              <div style={{ color: '#666' }}>
                📷 Clique para adicionar foto
              </div>
            </label>
          )}
        </div>

        {/* Botões */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            disabled={addMeal.isPending}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: 'transparent',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: addMeal.isPending ? 'not-allowed' : 'pointer',
              opacity: addMeal.isPending ? 0.5 : 1
            }}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={addMeal.isPending}
            style={{
              flex: 2,
              padding: '1rem',
              backgroundColor: addMeal.isPending ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: addMeal.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {addMeal.isPending ? 'Salvando...' : 'Registrar Refeição'}
          </button>
        </div>
      </form>
    </div>
  );
}
