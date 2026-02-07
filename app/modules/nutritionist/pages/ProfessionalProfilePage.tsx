import { useState, useEffect } from 'react';
import { useAuth } from '~/shared/contexts/AuthContext';
import { useNutritionistProfile, useUpdateNutritionistProfile, useCreateNutritionistProfile, useUpdateUser, uploadProfilePhoto } from '~/shared/hooks/useNutritionists';

const SPECIALTY_OPTIONS = [
  'Emagrecimento',
  'Ganho de Massa Muscular',
  'Nutrição Esportiva',
  'Gestantes e Lactantes',
  'Nutrição Infantil',
  'Terceira Idade',
  'Vegetarianismo/Veganismo',
  'Doenças Crônicas (Diabetes, Hipertensão)',
  'Distúrbios Alimentares',
  'Nutrição Funcional',
  'Nutrição Clínica',
  'Nutrição Comportamental'
];

export default function ProfessionalProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useNutritionistProfile(user?.id);
  const updateProfile = useUpdateNutritionistProfile();
  const createProfile = useCreateNutritionistProfile();
  const updateUser = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    specialties: [] as string[],
    bio: '',
    years_experience: 0,
    consultation_fee: 0,
    available: true
  });

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        specialties: profile.specialties || [],
        bio: profile.bio || '',
        years_experience: profile.years_experience || 0,
        consultation_fee: profile.consultation_fee || 0,
        available: profile.available ?? true
      });
    }
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const url = await uploadProfilePhoto(file);
      setAvatarUrl(url);
      
      if (user?.id) {
        updateUser.mutate({
          userId: user.id,
          avatarUrl: url
        }, {
          onSettled: () => {
            setUploadingPhoto(false);
          }
        });
      } else {
        setUploadingPhoto(false);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erro ao fazer upload da foto');
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    setIsSaving(true);

    // Timeout de segurança: se em 2s não resolveu, libera a UI
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout: forcing UI update');
      setIsEditing(false);
      setIsSaving(false);
    }, 2000);

    // Atualiza nome se foi alterado
    if (fullName !== user.user_metadata?.full_name) {
      updateUser.mutate({
        userId: user.id,
        fullName
      }, {
        onSettled: () => {
          clearTimeout(safetyTimeout);
          // Atualiza perfil profissional após nome
          if (profile) {
            updateProfile.mutate({
              userId: user.id,
              data: formData
            }, {
              onSettled: () => {
                setIsEditing(false);
                setIsSaving(false);
              }
            });
          } else {
            createProfile.mutate({
              userId: user.id,
              data: formData
            }, {
              onSettled: () => {
                setIsEditing(false);
                setIsSaving(false);
              }
            });
          }
        }
      });
    } else {
      // Se nome não mudou, só atualiza perfil
      if (profile) {
        updateProfile.mutate({
          userId: user.id,
          data: formData
        }, {
          onSettled: () => {
            clearTimeout(safetyTimeout);
            setIsEditing(false);
            setIsSaving(false);
          }
        });
      } else {
        createProfile.mutate({
          userId: user.id,
          data: formData
        }, {
          onSettled: () => {
            clearTimeout(safetyTimeout);
            setIsEditing(false);
            setIsSaving(false);
          }
        });
      }
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
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
          fontSize: '2rem',
          color: '#10b981'
        }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-24">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#1f2937'
        }}>Meu Perfil Profissional</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ✏️ Editar
          </button>
        )}
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        {/* User Info (Editável) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          <div style={{ position: 'relative' }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem'
              }}>
                👤
              </div>
            )}
            {isEditing && (
              <>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="photo-upload"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: uploadingPhoto ? 'not-allowed' : 'pointer',
                    border: '2px solid white',
                    fontSize: '0.75rem'
                  }}
                >
                  {uploadingPhoto ? '⏳' : '📷'}
                </label>
              </>
            )}
          </div>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}
              />
            ) : (
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>{fullName || 'Nutricionista'}</h2>
            )}
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              margin: 0
            }}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Bio */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Sobre Você
            </label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Conte um pouco sobre sua formação, experiência e abordagem..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            ) : (
              <p style={{
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                color: '#4b5563',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                {formData.bio || 'Nenhuma descrição adicionada'}
              </p>
            )}
          </div>

          {/* Specialties */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Especialidades
            </label>
            {isEditing ? (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {SPECIALTY_OPTIONS.map(specialty => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleSpecialty(specialty)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: formData.specialties.includes(specialty) ? '#10b981' : '#f3f4f6',
                      color: formData.specialties.includes(specialty) ? 'white' : '#4b5563',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {formData.specialties.length > 0 ? (
                  formData.specialties.map(s => (
                    <span
                      key={s}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#d1fae5',
                        color: '#059669',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    Nenhuma especialidade selecionada
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Years of Experience */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Anos de Experiência
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              ) : (
                <p style={{
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  color: '#1f2937',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  {formData.years_experience} anos
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Valor da Consulta (R$)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.consultation_fee}
                  onChange={(e) => setFormData({ ...formData, consultation_fee: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              ) : (
                <p style={{
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  color: '#1f2937',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  R$ {formData.consultation_fee.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Available Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              disabled={!isEditing}
              style={{
                width: '20px',
                height: '20px',
                cursor: isEditing ? 'pointer' : 'not-allowed'
              }}
            />
            <label
              htmlFor="available"
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#374151',
                cursor: isEditing ? 'pointer' : 'default'
              }}
            >
              Disponível para novas avaliações
            </label>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.5 : 1
                }}
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  if (profile) {
                    setFormData({
                      specialties: profile.specialties || [],
                      bio: profile.bio || '',
                      years_experience: profile.years_experience || 0,
                      consultation_fee: profile.consultation_fee || 0,
                      available: profile.available ?? true
                    });
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          )}
        </form>

        {/* Stats (Read-only) */}
        {!isEditing && profile && (
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>Estatísticas</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>⭐ {profile.rating.toFixed(1)}</p>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  marginTop: '0.25rem'
                }}>Avaliação Média</p>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>{profile.total_evaluations}</p>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  marginTop: '0.25rem'
                }}>Avaliações Concluídas</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
