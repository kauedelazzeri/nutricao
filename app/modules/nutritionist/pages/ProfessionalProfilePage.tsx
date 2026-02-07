import { useApp } from "~/shared/contexts/AppContext";
import type { Nutritionist } from "~/shared/types";

export default function ProfessionalProfilePage() {
  const { currentUser } = useApp();
  const nutri = currentUser as Nutritionist;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Meu Perfil Profissional</h1>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <img
            src={nutri?.avatar}
            alt=""
            className="w-24 h-24 rounded-full bg-gray-200"
          />
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900">{nutri?.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{nutri?.email}</p>
            <p className="text-sm text-green-600 font-medium mt-1">
              {(nutri as Nutritionist)?.crn}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Sobre</h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
              {(nutri as Nutritionist)?.bio}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {(nutri as Nutritionist)?.specialties?.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                ⭐ {(nutri as Nutritionist)?.rating}
              </p>
              <p className="text-xs text-gray-500 mt-1">Avaliação</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {(nutri as Nutritionist)?.evaluationsCompleted}
              </p>
              <p className="text-xs text-gray-500 mt-1">Avaliações Concluídas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
