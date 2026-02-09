import { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  
  const formattedDate = new Date(meal.date + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long'
  });

  return (
    <div 
      style={{
        backgroundColor: 'white',
        border: isHovered ? '1px solid #10b981' : '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1rem',
        boxShadow: isHovered ? '0 8px 24px rgba(16, 185, 129, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ flex: '1 1 auto', minWidth: '0' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.35rem 0.85rem',
            backgroundColor: '#d1fae5',
            color: '#059669',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            letterSpacing: '0.02em'
          }}>
            {MEAL_TYPE_LABELS[meal.meal_type] || meal.meal_type}
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '0.85rem',
            fontWeight: '500'
          }}>
            {meal.time.slice(0, 5)} • {formattedDate}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {onEdit && (
            <button
              onClick={() => onEdit(meal.id)}
              style={{
                padding: '0.625rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                minWidth: '2.5rem',
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.borderColor = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
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
                padding: '0.625rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#dc2626',
                transition: 'all 0.2s ease',
                minWidth: '2.5rem',
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.borderColor = '#dc2626';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
                e.currentTarget.style.borderColor = '#fecaca';
                e.currentTarget.style.color = '#dc2626';
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
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #f3f4f6'
        }}>
          <img
            src={meal.photo_url}
            alt="Foto da refeição"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '200px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      )}

      <p style={{
        color: '#374151',
        lineHeight: '1.6',
        margin: 0,
        fontSize: '0.95rem'
      }}>
        {meal.description}
      </p>
    </div>
  );
}
