import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "~/shared/contexts/AppContext";

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (role: "patient" | "nutritionist") => {
    login(role);
    if (role === "patient") {
      navigate("/app/timeline");
    } else {
      navigate("/nutri/dashboard");
    }
  };

  const scrollToLogin = () => {
    setShowLogin(true);
    setTimeout(() => {
      document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ==================== TOP NAVBAR ==================== */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <span className="text-xl font-bold text-gray-900">NutriSnap</span>
          </div>
          <button
            onClick={scrollToLogin}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-white px-6 py-20 pt-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            100% GRATUITO no lançamento
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Transforme sua alimentação
            <br />
            <span className="text-green-600">com um clique</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tire fotos das suas refeições e receba orientação profissional de nutricionistas.
            Simples, rápido e <strong>totalmente gratuito</strong> para começar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={scrollToLogin}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              📸 Começar Agora — Grátis
            </button>
            <button
              onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl text-base font-semibold border-2 border-gray-200 transition-all active:scale-95"
            >
              Como Funciona
            </button>
          </div>

          {/* Visual preview mockup */}
          <div className="relative max-w-sm mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center text-6xl">
                🥗
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-green-100 rounded-full w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ==================== PROBLEM SECTION ==================== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O problema que queremos resolver
            </h2>
            <p className="text-lg text-gray-600">
              Cuidar da alimentação não deveria ser complicado ou caro
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem cards */}
            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">😰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Acesso limitado</h3>
              <p className="text-sm text-gray-600">
                Consultas com nutricionistas são caras e infrequentes. Quando o plano acaba, você perde todo o histórico.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Registro complicado</h3>
              <p className="text-sm text-gray-600">
                Apps tradicionais exigem digitar cada alimento manualmente. Quem tem tempo para isso no dia a dia?
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Seus dados presos</h3>
              <p className="text-sm text-gray-600">
                Quando você cancela, perde acesso a tudo. Suas fotos, histórico, evolução — tudo bloqueado.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">💸</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Custo proibitivo</h3>
              <p className="text-sm text-gray-600">
                Acompanhamento nutricional mensal pode custar centenas de reais, tornando inacessível para muitos.
              </p>
            </div>
          </div>

          {/* Solution highlight */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-2xl font-bold mb-3">Nossa missão</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              <strong>Democratizar a alimentação saudável orientada por profissionais.</strong>
              <br />
              Seus dados são seus. O registro é instantâneo. A orientação é acessível.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="como-funciona" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-gray-600">
              Três passos simples para transformar sua alimentação
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tire fotos</h3>
              <p className="text-gray-600">
                Registre suas refeições com um clique. O app detecta automaticamente o horário e tipo de refeição.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Construa seu histórico</h3>
              <p className="text-gray-600">
                Suas fotos ficam organizadas em uma timeline. Sempre acessível, sempre seu.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <div className="text-4xl mb-4">👩‍⚕️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Receba orientação</h3>
              <p className="text-gray-600">
                Quando quiser, envie seu histórico para uma nutricionista avaliar. <strong>100% grátis</strong> no lançamento!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o NutriSnap?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl flex-shrink-0">⚡</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Registro instantâneo</h3>
                <p className="text-sm text-gray-600">
                  Uma foto e pronto. Sem digitar calorias, pesar alimentos ou preencher formulários.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl flex-shrink-0">🔓</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Seus dados são seus</h3>
                <p className="text-sm text-gray-600">
                  Acesso ilimitado ao seu histórico, independente de pagamentos ou planos ativos.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Orientação profissional</h3>
                <p className="text-sm text-gray-600">
                  Nutricionistas certificadas analisam suas refeições e enviam pareceres personalizados.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl flex-shrink-0">💰</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Preço justo</h3>
                <p className="text-sm text-gray-600">
                  <strong className="text-green-600">Totalmente grátis no lançamento.</strong> No futuro, valores acessíveis por avaliação.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl flex-shrink-0">🔐</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Login simplificado</h3>
                <p className="text-sm text-gray-600">
                  Entre com Google ou Apple em segundos. Sem senhas para lembrar.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl flex-shrink-0">📱</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Mobile-first</h3>
                <p className="text-sm text-gray-600">
                  Interface otimizada para celular. Tire foto, registre e pronto — tudo em segundos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA / LOGIN SECTION ==================== */}
      <section
        id="login-section"
        className={`py-20 px-6 bg-gradient-to-br from-green-50 via-emerald-50 to-white transition-all ${
          showLogin ? "min-h-screen flex items-center" : ""
        }`}
      >
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🥗</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Comece hoje, gratuitamente
            </h2>
            <p className="text-gray-600">
              Entre em segundos e transforme sua alimentação
            </p>
          </div>

          {/* Login buttons */}
          <div className="space-y-3 mb-10">
            <button
              onClick={() => handleLogin("patient")}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Entrar com Google
            </button>

            <button
              onClick={() => handleLogin("patient")}
              className="w-full flex items-center justify-center gap-3 bg-black rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-gray-800 shadow-sm transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Entrar com Apple
            </button>
          </div>

          {/* Separator */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white text-gray-400">
                ou acesse como
              </span>
            </div>
          </div>

          <button
            onClick={() => handleLogin("nutritionist")}
            className="w-full flex items-center justify-center gap-2 bg-green-600 rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-green-700 shadow-sm transition-all active:scale-[0.98]"
          >
            👩‍⚕️ Sou Nutricionista
          </button>

          <p className="text-xs text-gray-400 text-center mt-8">
            Ao entrar, você concorda com os Termos de Uso e Política de Privacidade
          </p>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-3xl mb-4">🥗</div>
          <h3 className="text-white text-lg font-bold mb-2">NutriSnap</h3>
          <p className="text-sm mb-6">
            Democratizando a alimentação saudável orientada por profissionais
          </p>
          <p className="text-xs">
            © 2026 NutriSnap. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
