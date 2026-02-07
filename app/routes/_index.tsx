import { supabase } from '~/shared/services/supabase';

export default function Index() {
  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f0fdf4',
        zIndex: 1000,
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'clamp(0.75rem, 3vw, 1.5rem) clamp(1rem, 3vw, 5%)',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            🥗 NutriSnap
          </div>
          
          <button
            onClick={handleGoogleLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.75rem)',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </header>

      {/* Spacer para compensar header fixo */}
      <div style={{ height: 'clamp(60px, 15vw, 84px)' }}></div>

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#f0fdf4',
        padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 3vw, 5%) clamp(3rem, 6vw, 5rem)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#d1fae5',
            borderRadius: '20px',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#10b981'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }}></span>
            100% GRATUITO no lançamento
          </div>

          {/* Hero Title */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            color: '#1f2937',
            lineHeight: '1.1',
            marginBottom: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto 1.5rem'
          }}>
            Transforme sua alimentação{' '}
            <span style={{ color: '#10b981' }}>com um clique</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            color: '#6b7280',
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6'
          }}>
            Tire fotos das suas refeições e receba orientação profissional de
            nutricionistas. Simples, rápido e{' '}
            <strong style={{ color: '#1f2937' }}>totalmente gratuito</strong> para começar.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <button
              onClick={handleGoogleLogin}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.25rem, 4vw, 2rem)',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Começar Agora — Grátis
            </button>

            <a
              href="#como-funciona"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.25rem, 4vw, 2rem)',
                backgroundColor: 'white',
                color: '#1f2937',
                textDecoration: 'none',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: 'clamp(0.95rem, 3vw, 1.1rem)'
              }}
            >
              Como Funciona
            </a>
          </div>

          {/* Mockup Card */}
          <div style={{
            maxWidth: '400px',
            margin: '0 auto',
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '16px',
              padding: '3rem 2rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '5rem'
              }}>
                🥗
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{
                height: '12px',
                backgroundColor: '#d1fae5',
                borderRadius: '6px',
                width: '60%'
              }}></div>
              <div style={{
                height: '8px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                width: '40%'
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Missão */}
      <section style={{
        backgroundColor: '#10b981',
        padding: '4rem 5%',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💡</div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '700',
            color: 'white',
            marginBottom: '1.5rem'
          }}>
            Nossa missão
          </h2>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            color: 'white',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            Democratizar a alimentação saudável orientada por profissionais.
          </p>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            color: 'white',
            lineHeight: '1.6'
          }}>
            Seus dados são seus. O registro é instantâneo. A orientação é acessível.
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" style={{
        backgroundColor: '#f9fafb',
        padding: '5rem 5%',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Como funciona
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            marginBottom: '4rem'
          }}>
            Três passos simples para transformar sua alimentação
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem'
          }}>
            {[
              {
                number: '1',
                emoji: '📷',
                title: 'Tire fotos',
                description: 'Registre suas refeições com um clique. O app detecta automaticamente o horário e tipo de refeição.'
              },
              {
                number: '2',
                emoji: '📊',
                title: 'Construa seu histórico',
                description: 'Suas fotos ficam organizadas em uma timeline. Sempre acessível, sempre seu.'
              },
              {
                number: '3',
                emoji: '🏅',
                title: 'Receba orientação',
                description: 'Quando quiser, envie seu histórico para uma nutricionista avaliar. 100% grátis no lançamento!'
              }
            ].map((step) => (
              <div key={step.number} style={{
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {step.number}
                </div>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {step.emoji}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  lineHeight: '1.6'
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section style={{
        backgroundColor: 'white',
        padding: '5rem 5%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '4rem'
          }}>
            Por que escolher o NutriSnap?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            textAlign: 'left'
          }}>
            {[
              {
                emoji: '⚡',
                title: 'Registro instantâneo',
                description: 'Uma foto e pronto. Sem digitar calorias, pesar alimentos ou preencher formulários.'
              },
              {
                emoji: '🔐',
                title: 'Seus dados são seus',
                description: 'Acesso ilimitado ao seu histórico, independente de pagamentos ou planos ativos.'
              },
              {
                emoji: '🎯',
                title: 'Orientação profissional',
                description: 'Nutricionistas certificadas analisam suas refeições e enviam pareceres personalizados.'
              },
              {
                emoji: '💰',
                title: 'Preço justo',
                description: (
                  <>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>Totalmente grátis no lançamento.</span>
                    {' '}No futuro, valores acessíveis por avaliação.
                  </>
                )
              },
              {
                emoji: '🔒',
                title: 'Login simplificado',
                description: 'Entre com Google ou Apple em segundos. Sem senhas para lembrar.'
              },
              {
                emoji: '📱',
                title: 'Mobile-first',
                description: 'Interface otimizada para celular. Tire foto, registre e pronto — tudo em segundos.'
              }
            ].map((feature, idx) => (
              <div key={idx} style={{
                padding: '2rem',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem'
                }}>
                  {feature.emoji}
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{
        backgroundColor: '#d1fae5',
        padding: '5rem 5%',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🥗</div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Comece hoje, gratuitamente
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            marginBottom: '2.5rem'
          }}>
            Entre em segundos e transforme sua alimentação
          </p>
          <button
            onClick={handleGoogleLogin}
            style={{
              display: 'inline-block',
              padding: '1.2rem 3rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '1.2rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              cursor: 'pointer'
            }}
          >
            Começar Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1f2937',
        padding: '3rem 5%',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '1rem'
          }}>
            NutriSnap
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#9ca3af',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Democratizando a alimentação saudável orientada por profissionais
          </p>
          <p style={{
            fontSize: '0.9rem',
            color: '#6b7280'
          }}>
            © 2026 NutriSnap. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
