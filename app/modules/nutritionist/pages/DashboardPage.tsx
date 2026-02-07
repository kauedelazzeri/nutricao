import { Link } from "react-router";
import { useApp } from "~/shared/contexts/AppContext";
import { EVALUATION_STATUS_LABELS } from "~/shared/types";
import { formatShortDate } from "~/shared/utils/mealClassifier";

export default function DashboardPage() {
  const { evaluations, currentUser } = useApp();

  // For the nutritionist, show evals assigned to them OR open (null nutritionistId)
  const relevantEvals = evaluations.filter(
    (e) =>
      e.nutritionistId === currentUser?.id || e.nutritionistId === null
  );

  const pending = relevantEvals.filter((e) => e.status === "pending");
  const inProgress = relevantEvals.filter((e) => e.status === "in-progress");
  const completed = relevantEvals.filter((e) => e.status === "completed");

  const stats = [
    { label: "Novas", count: pending.length, color: "bg-yellow-500", icon: "📩" },
    { label: "Em Análise", count: inProgress.length, color: "bg-blue-500", icon: "🔍" },
    { label: "Concluídas", count: completed.length, color: "bg-green-500", icon: "✅" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie as solicitações de avaliação dos seus pacientes
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <span
                className={`w-3 h-3 rounded-full ${s.color}`}
              />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{s.count}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Requests list */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Solicitações</h2>

        {relevantEvals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500 text-sm">Nenhuma solicitação recebida ainda.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {relevantEvals.map((ev) => (
              <Link
                key={ev.id}
                to={`/nutri/request/${ev.id}`}
                className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Paciente #{ev.patientId}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ev.period} dias • {ev.meals.length} refeições • R$ {ev.price},00
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      statusColors[ev.status]
                    }`}
                  >
                    {EVALUATION_STATUS_LABELS[ev.status]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {ev.meals.slice(0, 4).map((meal) => (
                      <img
                        key={meal.id}
                        src={meal.photoUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ))}
                    {ev.meals.length > 4 && (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-[10px] text-gray-500 font-medium">
                          +{ev.meals.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatShortDate(ev.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
