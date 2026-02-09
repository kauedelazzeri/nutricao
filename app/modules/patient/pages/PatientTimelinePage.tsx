import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useMeals, useDeleteMeal } from '~/shared/hooks/useMeals';
import { MealCard } from '~/shared/components/MealCard';
import QuickCaptureModal from '~/shared/components/QuickCaptureModal';
import type { Meal } from '~/shared/types';

type FilterPeriod = 7 | 14 | 30 | 'all';

const FILTER_OPTIONS: { value: FilterPeriod; label: string }[] = [
  { value: 7, label: '7 dias' },
  { value: 14, label: '14 dias' },
  { value: 30, label: '30 dias' },
  { value: 'all', label: 'Tudo' },
];

interface GroupedMeals {
  [date: string]: Meal[];
}

export default function PatientTimelinePage() {
  const navigate = useNavigate();
  const { data: meals, isLoading, error, refetch } = useMeals();
  const deleteMeal = useDeleteMeal();
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [filter, setFilter] = useState<FilterPeriod>(7);

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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        gap: '1rem'
      }}>
        <div style={{
          fontSize: '3rem'
        }}>🥗</div>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #d1fae5',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Carregando refeições...</p>
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
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>😕</div>
        <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Ops! Algo deu errado</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Não foi possível carregar suas refeições
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
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
      <>
        <div style={{
          maxWidth: '600px',
          margin: '2rem auto',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '5rem',
            marginBottom: '1.5rem'
          }}>🍽️</div>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.75rem'
          }}>Sua jornada começa aqui!</h2>
          <p style={{
            color: '#6b7280',
            fontSize: '1.05rem',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Registre sua primeira refeição e comece a acompanhar sua alimentação com a ajuda de nutricionistas
          </p>
          <button
            onClick={() => setShowCaptureModal(true)}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.05rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          >
            📸 Capturar Refeição
          </button>
        </div>
        
        {/* Modal de captura rápida */}
        <QuickCaptureModal
          isOpen={showCaptureModal}
          onClose={() => setShowCaptureModal(false)}
          onSuccess={() => refetch()}
        />
      </>
    );
  }

  // Filtrar refeições por período
  const filteredMeals = useMemo(() => {
    if (!meals) return [];
    if (filter === 'all') return meals;
    
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filter);
    cutoff.setHours(0, 0, 0, 0);
    
    return meals.filter((meal) => {
      const mealDate = new Date(meal.date + 'T00:00:00');
      return mealDate >= cutoff;
    });
  }, [meals, filter]);

  // Agrupar refeições por data
  const groupedMeals = filteredMeals.reduce((acc, meal) => {
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
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        paddingBottom: '8rem', // Espaço maior para bottom bar + FAB
        background: 'linear-gradient(to bottom, #f0fdf4 0%, #ffffff 300px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '700',
              color: '#1f2937',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Timeline</h1>
            <p style={{
              margin: '0.25rem 0 0 0',
              color: '#6b7280',
              fontSize: '0.95rem'
            }}>Suas refeições registradas</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#10b981',
              lineHeight: '1'
            }}>{meals?.length || 0}</div>
            <div style={{
              fontSize: '0.7rem',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '0.25rem'
            }}>Refeições</div>
          </div>
        </div>

        {/* Filtro de período */}
        <div style={{
          marginBottom: '2rem',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Período</span>
            <span style={{
              fontSize: '0.8rem',
              color: '#9ca3af'
            }}>
              {filteredMeals.length} {filteredMeals.length === 1 ? 'refeição' : 'refeições'}
            </span>
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  border: filter === opt.value ? 'none' : '1px solid #e5e7eb',
                  backgroundColor: filter === opt.value ? '#10b981' : 'white',
                  color: filter === opt.value ? 'white' : '#6b7280',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: filter === opt.value ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (filter !== opt.value) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== opt.value) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {sortedDates.map(date => {
          const dateObj = new Date(date + 'T00:00:00');
          const formattedDate = dateObj.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
          });

          return (
            <div key={date} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                {formattedDate}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
          bottom: '88px',
          right: '20px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          fontSize: '2rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40,
          transition: 'all 0.3s ease',
          transform: 'scale(1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
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
