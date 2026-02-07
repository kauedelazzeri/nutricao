import { useApp } from "~/shared/contexts/AppContext";

const STATUS_MAP = {
  pending: { label: "Pendente", color: "#ff9800", bg: "#fff3e0" },
  accepted: { label: "Aceito", color: "#2196f3", bg: "#e3f2fd" },
  rejected: { label: "Rejeitado", color: "#f44336", bg: "#ffebee" },
  completed: { label: "Concluído", color: "#4caf50", bg: "#e8f5e9" },
};

export default function EvaluationsPage() {
  const { evaluations, currentUser } = useApp();

  const myEvaluations = evaluations.filter(
    (ev) => ev.patientId === (currentUser?.id ?? "p1")
  );

  if (myEvaluations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma avaliação
          </h2>
          <p className="text-gray-600 mb-6">
            Você ainda não solicitou nenhuma avaliação nutricional
          </p>
          <a
            href="/demo/nutritionist/dashboard"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Ver Demo Nutricionista
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Minhas Avaliações
      </h1>

      <div className="space-y-4">
        {myEvaluations.map((evaluation) => {
          const nutritionist = evaluation.nutritionist;
          const status = STATUS_MAP[evaluation.status];

          return (
            <div
              key={evaluation.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">
                      👨‍⚕️
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {nutritionist.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        CRN {nutritionist.crn}
                      </p>
                    </div>
                  </div>

                  <div
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: status.bg,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </div>
                </div>

                {/* Request Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📅</span>
                    <span>
                      Solicitado em{" "}
                      {new Date(evaluation.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>

                  {evaluation.reason && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-0.5">💬</span>
                      <p className="flex-1">{evaluation.reason}</p>
                    </div>
                  )}
                </div>

                {/* Response */}
                {evaluation.status === "rejected" && evaluation.rejectReason && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-red-900 mb-1">
                      Motivo da recusa:
                    </p>
                    <p className="text-sm text-red-700">
                      {evaluation.rejectReason}
                    </p>
                  </div>
                )}

                {evaluation.status === "accepted" && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-900">
                      ✅ Sua avaliação foi aceita! O nutricionista está
                      analisando seu caso.
                    </p>
                  </div>
                )}

                {evaluation.status === "completed" && evaluation.feedback && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-green-900 mb-2">
                      📝 Parecer do Nutricionista:
                    </p>
                    <p className="text-sm text-green-800 whitespace-pre-wrap">
                      {evaluation.feedback}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {evaluation.status === "completed" && (
                  <button className="w-full mt-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Ver Avaliação Completa
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
