import { useNavigate } from 'react-router';
import { useMeals, useDeleteMeal } from '~/shared/hooks/useMeals';
import { MealCard } from '~/shared/components/MealCard';
import type { Meal } from '~/shared/types';

interface GroupedMeals {
  [date: string]: Meal[];
}

export default function PatientTimelinePage() {
  const navigate = useNavigate();
  const { data: meals, isLoading, error } = useMeals();
  const deleteMeal = useDeleteMeal();

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
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0 }}>Timeline de Refeições</h1>
        <button
          onClick={() => navigate('/app/patient/register-meal')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + Nova Refeição
        </button>
      </div>

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
        ← Voltar ao dashboard
      </button>

      {sortedDates.map(date => {
        const dateObj = new Date(date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

        return (
          <div key={date} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '1rem',
              textTransform: 'capitalize'
            }}>
              {formattedDate}
            </h2>
            
            {groupedMeals[date].map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
