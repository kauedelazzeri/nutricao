import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMeals, useDeleteMeal } from '~/shared/hooks/useMeals';
import { MealCard } from '~/shared/components/MealCard';
import QuickCaptureModal from '~/shared/components/QuickCaptureModal';
import type { Meal } from '~/shared/types';

interface GroupedMeals {
  [date: string]: Meal[];
}

export default function PatientTimelinePage() {
  const navigate = useNavigate();
  const { data: meals, isLoading, error, refetch } = useMeals();
  const deleteMeal = useDeleteMeal();
  const [showCaptureModal, setShowCaptureModal] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteMeal.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Erro ao excluir refeição. Tente novamente.');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/app/patient/edit-meal/${id}`);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4caf50',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#f44336', marginBottom: '1rem' }}>
          Erro ao carregar refeições
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Empty state
  if (!meals || meals.length === 0) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          🍽️
        </div>
        <h2 style={{ marginBottom: '0.5rem' }}>Nenhuma refeição registrada</h2>
        <p style={{
          color: '#666',
          marginBottom: '2rem'
        }}>
          Comece registrando sua primeira refeição
        </p>
        <button
          onClick={() => navigate('/app/patient/register-meal')}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Registrar Refeição
        </button>
      </div>
    );
  }

  // Agrupar refeições por data
  const groupedMeals = meals.reduce((acc, meal) => {
    const date = meal.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as GroupedMeals);

  const sortedDates = Object.keys(groupedMeals).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem',
        paddingBottom: '6rem' // Espaço para bottom bar
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Timeline</h1>
        </div>

        {sortedDates.map(date => {
          const dateObj = new Date(date + 'T00:00:00');
          const formattedDate = dateObj.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
          });

          return (
            <div key={date} style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                marginBottom: '1rem',
                textTransform: 'capitalize',
                fontWeight: '500'
              }}>
                {formattedDate}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {groupedMeals[date].map(meal => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão flutuante de captura */}
      <button
        onClick={() => setShowCaptureModal(true)}
        style={{
          position: 'fixed',
          bottom: '80px', // Acima do bottom bar
          right: '20px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          fontSize: '2rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}
      >
        +
      </button>

      {/* Modal de captura rápida */}
      <QuickCaptureModal
        isOpen={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
}
