import type { Meal } from '~/shared/types';

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Café da manhã',
  morning_snack: 'Lanche da manhã',
  lunch: 'Almoço',
  afternoon_snack: 'Lanche da tarde',
  dinner: 'Jantar',
  supper: 'Ceia'
};

interface MealCardProps {
  meal: Meal;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function MealCard({ meal, onDelete, onEdit }: MealCardProps) {
  const formattedDate = new Date(meal.date + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long'
  });

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem'
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            {MEAL_TYPE_LABELS[meal.meal_type] || meal.meal_type}
          </div>
          <div style={{
            color: '#666',
            fontSize: '0.9rem'
          }}>
            {meal.time.slice(0, 5)} • {formattedDate}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(meal.id)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Excluir esta refeição?')) {
                  onDelete(meal.id);
                }
              }}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid #f44336',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: '#f44336'
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {meal.photo_url && (
        <div style={{
          marginBottom: '1rem',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <img
            src={meal.photo_url}
            alt="Foto da refeição"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      )}

      <p style={{
        color: '#333',
        lineHeight: '1.6',
        margin: 0
      }}>
        {meal.description}
      </p>
    </div>
  );
}
