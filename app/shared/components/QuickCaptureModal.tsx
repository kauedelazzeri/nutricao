import { useState, useRef } from 'react';
import { uploadToCloudinary } from '~/shared/services/cloudinary';
import { inferMealTypeFromTime } from '~/shared/utils/mealTypeInference';
import { supabase } from '~/shared/services/supabase';
import { useAuth } from '~/shared/contexts/AuthContext';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuickCaptureModal({ isOpen, onClose, onSuccess }: QuickCaptureModalProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (!user) return;

    try {
      setIsUploading(true);

      // 1. Upload da imagem para Cloudinary
      const photoUrl = await uploadToCloudinary(file);

      // 2. Pegar data/hora atual e inferir tipo de refeição
      const now = new Date();
      const mealType = inferMealTypeFromTime(now);

      // 3. Salvar no Supabase
      const { error } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          photo_url: photoUrl,
          meal_type: mealType,
          description: '', // Vazio conforme solicitado
          date: now.toISOString().split('T')[0], // Apenas a data (YYYY-MM-DD)
          time: now.toTimeString().split(' ')[0].substring(0, 5) // Apenas o horário (HH:MM)
        } as any);

      if (error) throw error;

      // 4. Sucesso - fechar modal e atualizar lista
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar refeição:', error);
      alert('Erro ao salvar refeição. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = ''; // Reset input
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={isUploading ? undefined : onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s'
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '1.5rem',
          zIndex: 9999,
          animation: 'slideUp 0.3s',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {isUploading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #10b981',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#6b7280' }}>Salvando refeição...</p>
          </div>
        ) : (
          <>
            <div style={{
              width: '40px',
              height: '4px',
              backgroundColor: '#e5e7eb',
              borderRadius: '2px',
              margin: '0 auto 1.5rem'
            }}></div>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Registrar Refeição
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {/* Botão Câmera */}
              <button
                onClick={handleCameraClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: '#f9fafb',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#1f2937',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#10b981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#10b981',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  📷
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Tirar Foto
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Abrir câmera do dispositivo
                  </div>
                </div>
              </button>

              {/* Botão Galeria */}
              <button
                onClick={handleGalleryClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: '#f9fafb',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#1f2937',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#10b981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  🖼️
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Escolher da Galeria
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Selecionar foto existente
                  </div>
                </div>
              </button>
            </div>

            {/* Botão Cancelar */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                color: '#6b7280'
              }}
            >
              Cancelar
            </button>
          </>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
