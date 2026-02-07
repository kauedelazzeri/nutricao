import { Link } from 'react-router';

export default function Index() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#f0fdf4',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 5%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          🥗 NutriSnap
        </div>
        
        <Link
          to="/auth/login"
          style={{
            padding: '0.75rem 1.75rem',
            backgroundColor: '#10b981',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Entrar
        </Link>
      </header>

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#f0fdf4',
        padding: '3rem 5% 5rem'
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
            <Link
              to="/auth/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                backgroundColor: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              📸 Começar Agora — Grátis
            </Link>

            <a
              href="#como-funciona"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#1f2937',
                textDecoration: 'none',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}
            >
              Como Funciona
            </a>
          </div>

          {/* Mockup Card */}
          <div style={{
            maxWidth: '400px',
            margin: '0 auto',
            padding: '2rem',
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
          <Link
            to="/auth/login"
            style={{
              display: 'inline-block',
              padding: '1.2rem 3rem',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '1.2rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          >
            Começar Agora
          </Link>
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
