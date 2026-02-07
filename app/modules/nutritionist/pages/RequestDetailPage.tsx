import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "~/shared/contexts/AppContext";
import {
  MEAL_TYPE_LABELS,
  MEAL_TYPE_ICONS,
  EVALUATION_STATUS_LABELS,
  HEALTH_GOAL_LABELS,
} from "~/shared/types";
import { formatDate, formatTime, groupMealsByDay } from "~/shared/utils/mealClassifier";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    evaluations,
    acceptEvaluation,
    completeEvaluation,
    rejectEvaluation,
  } = useApp();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const evaluation = evaluations.find((e) => e.id === id);

  if (!evaluation) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Solicitação não encontrada.</p>
      </div>
    );
  }

  const grouped = groupMealsByDay(evaluation.meals);
  const days = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const hp = evaluation.healthProfile;

  const bmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Abaixo do peso", color: "text-blue-600" };
    if (bmi < 25) return { label: "Peso normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Sobrepeso", color: "text-yellow-600" };
    return { label: "Obesidade", color: "text-red-600" };
  };

  const bmi = bmiCategory(hp.bmi);

  const handleAccept = () => acceptEvaluation(evaluation.id);
  const handleReject = () => {
    rejectEvaluation(evaluation.id);
    navigate("/nutri/dashboard");
  };
  const handleComplete = () => {
    if (feedback.trim()) {
      completeEvaluation(evaluation.id, feedback);
      navigate("/nutri/dashboard");
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Photo lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt=""
            className="max-w-full max-h-full rounded-2xl object-contain"
          />
        </div>
      )}

      {/* Back + Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/nutri/dashboard")}
          className="text-sm text-gray-500 hover:text-gray-900 mb-3 inline-block"
        >
          ← Voltar ao Dashboard
        </button>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Avaliação #{evaluation.id.slice(-4)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {evaluation.period} dias • {evaluation.meals.length} refeições • R${" "}
              {evaluation.price},00
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              statusColors[evaluation.status]
            }`}
          >
            {EVALUATION_STATUS_LABELS[evaluation.status]}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Patient info */}
        <div className="md:col-span-1 space-y-4">
          {/* Health profile card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              👤 Dados do Paciente
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-lg font-bold text-gray-900">{hp.weight}</p>
                  <p className="text-[10px] text-gray-500">kg</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-lg font-bold text-gray-900">{hp.height}</p>
                  <p className="text-[10px] text-gray-500">cm</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className={`text-lg font-bold ${bmi.color}`}>{hp.bmi}</p>
                  <p className="text-[10px] text-gray-500">IMC</p>
                </div>
              </div>
              <p className={`text-xs font-medium ${bmi.color}`}>{bmi.label}</p>

              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  Objetivo
                </p>
                <p className="text-sm font-medium text-gray-900">
                  🎯 {HEALTH_GOAL_LABELS[hp.goal]}
                </p>
              </div>

              {hp.dietaryRestrictions.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Restrições
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {hp.dietaryRestrictions.map((r) => (
                      <span
                        key={r}
                        className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium"
                      >
                        ⚠️ {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hp.notes && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Observações
                  </p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl">
                    {hp.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {evaluation.status === "pending" && (
            <div className="space-y-2">
              <button
                onClick={handleAccept}
                className="w-full bg-green-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-700 transition-colors"
              >
                ✅ Aceitar Solicitação
              </button>
              <button
                onClick={handleReject}
                className="w-full bg-white border border-red-200 text-red-600 rounded-xl py-3 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                ❌ Recusar
              </button>
            </div>
          )}

          {/* Feedback area */}
          {evaluation.status === "in-progress" && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                📝 Seu Parecer
              </h2>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
                placeholder="Escreva seu parecer nutricional aqui..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-3"
              />
              <button
                onClick={handleComplete}
                disabled={!feedback.trim()}
                className="w-full bg-green-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar Parecer
              </button>
            </div>
          )}

          {/* Show existing feedback */}
          {evaluation.status === "completed" && evaluation.feedback && (
            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <h2 className="text-sm font-semibold text-green-800 mb-2">
                📝 Parecer Enviado
              </h2>
              <p className="text-sm text-green-700 leading-relaxed">
                {evaluation.feedback}
              </p>
            </div>
          )}
        </div>

        {/* Right: Meal gallery */}
        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            📸 Refeições do Período
          </h2>

          <div className="space-y-6">
            {days.map((day) => (
              <div key={day}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {formatDate(grouped[day][0].timestamp)}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {grouped[day].map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => setSelectedPhoto(meal.photoUrl)}
                      className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={meal.photoUrl}
                        alt=""
                        className="w-full h-32 md:h-40 object-cover"
                        loading="lazy"
                      />
                      <div className="px-3 py-2 flex items-center gap-1.5">
                        <span className="text-sm">
                          {MEAL_TYPE_ICONS[meal.mealType]}
                        </span>
                        <span className="text-xs text-gray-700 font-medium">
                          {MEAL_TYPE_LABELS[meal.mealType]}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {formatTime(meal.timestamp)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
