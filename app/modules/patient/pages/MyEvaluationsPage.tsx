import { Link } from "react-router";
import { useApp } from "~/shared/contexts/AppContext";
import { EVALUATION_STATUS_LABELS } from "~/shared/types";
import { formatDate } from "~/shared/utils/mealClassifier";

export default function MyEvaluationsPage() {
  const { evaluations, nutritionists, currentUser } = useApp();

  const myEvals = evaluations.filter(
    (e) => e.patientId === (currentUser?.id ?? "p1")
  );

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Minhas Avaliações</h1>
        <Link
          to="/app/request-evaluation"
          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-700 transition-colors"
        >
          + Nova
        </Link>
      </header>

      <div className="px-4 py-4 space-y-3">
        {myEvals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 text-sm">
              Nenhuma avaliação solicitada ainda.
            </p>
            <Link
              to="/app/request-evaluation"
              className="inline-block mt-4 text-sm text-green-600 font-medium hover:underline"
            >
              Solicitar primeira avaliação →
            </Link>
          </div>
        ) : (
          myEvals.map((ev) => {
            const nutri = nutritionists.find((n) => n.id === ev.nutritionistId);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={nutri?.avatar ?? "https://api.dicebear.com/7.x/avataaars/svg?seed=any"}
                      alt=""
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {nutri?.name ?? "Qualquer nutricionista"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ev.period} dias • {ev.meals.length} refeições
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      statusColors[ev.status]
                    }`}
                  >
                    {EVALUATION_STATUS_LABELS[ev.status]}
                  </span>
                </div>

                <div className="text-xs text-gray-400 mb-2">
                  Solicitado em {formatDate(ev.createdAt)}
                </div>

                {/* Show feedback if completed */}
                {ev.status === "completed" && ev.feedback && (
                  <div className="bg-green-50 rounded-xl p-3 mt-2">
                    <p className="text-xs font-semibold text-green-800 mb-1">
                      📝 Parecer da Nutricionista
                    </p>
                    <p className="text-xs text-green-700 leading-relaxed">
                      {ev.feedback}
                    </p>
                  </div>
                )}

                {/* Meal photo thumbnails */}
                <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
                  {ev.meals.slice(0, 6).map((meal) => (
                    <img
                      key={meal.id}
                      src={meal.photoUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ))}
                  {ev.meals.length > 6 && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gray-500 font-medium">
                        +{ev.meals.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
