import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "~/shared/contexts/AppContext";
import { EVALUATION_PRICES } from "~/shared/types";
import type { EvaluationPeriod } from "~/shared/types";

export default function RequestEvaluationPage() {
  const { nutritionists, createEvaluation, meals, currentUser } = useApp();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<EvaluationPeriod>(7);
  const [selectedNutri, setSelectedNutri] = useState<string | null>(null);
  const [step, setStep] = useState<"period" | "nutritionist" | "confirm">("period");

  const userMeals = meals.filter((m) => m.patientId === (currentUser?.id ?? "p1"));
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - period);
  const mealsInPeriod = userMeals.filter((m) => new Date(m.timestamp) >= cutoff);

  const handleConfirm = () => {
    createEvaluation(period, selectedNutri);
    navigate("/app/evaluations");
  };

  const selectedNutritionistData = nutritionists.find((n) => n.id === selectedNutri);

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => {
            if (step === "period") navigate(-1);
            else if (step === "nutritionist") setStep("period");
            else setStep("nutritionist");
          }}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 
        </button>
        <h1 className="text-lg font-bold text-gray-900">Solicitar Avaliação</h1>
      </header>

      <div className="px-4 py-6">
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {["Período", "Nutricionista", "Confirmar"].map((label, i) => {
            const stepNames = ["period", "nutritionist", "confirm"] as const;
            const isActive = stepNames.indexOf(step) >= i;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-xs ${isActive ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  {label}
                </span>
                {i < 2 && <div className="w-6 h-px bg-gray-300" />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Period */}
        {step === "period" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Escolha o período de avaliação
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              A nutricionista receberá as fotos das suas refeições do período selecionado.
            </p>

            {([7, 30] as EvaluationPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  period === p
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Últimos {p} dias
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {mealsInPeriod.length} refeições registradas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      R$ {EVALUATION_PRICES[p]},00
                    </p>
                  </div>
                </div>
              </button>
            ))}

            <button
              onClick={() => setStep("nutritionist")}
              className="w-full bg-green-600 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-green-700 transition-colors mt-6 active:scale-[0.98]"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Nutritionist */}
        {step === "nutritionist" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Escolha uma nutricionista
            </h2>

            {/* Open option */}
            <button
              onClick={() => setSelectedNutri(null)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedNutri === null
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                  🌐
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Qualquer nutricionista</p>
                  <p className="text-xs text-gray-500">
                    A primeira disponível aceitará sua solicitação
                  </p>
                </div>
              </div>
            </button>

            {nutritionists.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNutri(n.id)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedNutri === n.id
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={n.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{n.name}</p>
                    <p className="text-xs text-gray-500">{n.crn}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-yellow-600">⭐ {n.rating}</span>
                      <span className="text-xs text-gray-400">
                        • {n.evaluationsCompleted} avaliações
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {n.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            ))}

            <button
              onClick={() => setStep("confirm")}
              className="w-full bg-green-600 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-green-700 transition-colors mt-4 active:scale-[0.98]"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <div className="space-y-6">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Confirmar Solicitação
            </h2>

            {/* Promo banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-4 py-1.5 rounded-full rotate-12 shadow-md">
                PROMOÇÃO 🎉
              </div>
              <p className="text-sm font-medium opacity-90 mb-1">Lançamento NutriSnap</p>
              <p className="text-2xl font-extrabold">Avaliação Grátis!</p>
              <p className="text-xs opacity-80 mt-1">
                Por tempo limitado, todas as avaliações são 100% gratuitas.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Período</span>
                <span className="text-sm font-medium text-gray-900">
                  Últimos {period} dias
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Refeições</span>
                <span className="text-sm font-medium text-gray-900">
                  {mealsInPeriod.length} fotos
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Nutricionista</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedNutritionistData?.name ?? "Qualquer disponível"}
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    R$ {EVALUATION_PRICES[period]},00
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    GRÁTIS
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Seu perfil de saúde e fotos serão compartilhados com a nutricionista selecionada.
            </p>

            <button
              onClick={handleConfirm}
              className="w-full bg-green-600 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-green-700 transition-colors active:scale-[0.98]"
            >
              ✅ Confirmar Solicitação Gratuita
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
