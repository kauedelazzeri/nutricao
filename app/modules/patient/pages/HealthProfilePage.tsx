import { useState } from "react";
import { useApp } from "~/shared/contexts/AppContext";
import { HEALTH_GOAL_LABELS } from "~/shared/types";
import type { HealthGoal } from "~/shared/types";

export default function HealthProfilePage() {
  const { healthProfile, updateHealthProfile, currentUser, logout } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...healthProfile });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateHealthProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Abaixo do peso", color: "text-blue-600" };
    if (bmi < 25) return { label: "Peso normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Sobrepeso", color: "text-yellow-600" };
    return { label: "Obesidade", color: "text-red-600" };
  };

  const bmi = bmiCategory(healthProfile.bmi);

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">Meu Perfil</h1>
      </header>

      {saved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✅ Perfil atualizado!
        </div>
      )}

      <div className="px-4 py-6 space-y-6">
        {/* User card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <img
            src={currentUser?.avatar}
            alt=""
            className="w-20 h-20 rounded-full mx-auto mb-3 bg-gray-200"
          />
          <h2 className="text-lg font-bold text-gray-900">{currentUser?.name}</h2>
          <p className="text-sm text-gray-500">{currentUser?.email}</p>
        </div>

        {/* BMI Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Dados de Saúde</h3>
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs text-green-600 font-medium hover:underline"
            >
              {editing ? "Cancelar" : "Editar"}
            </button>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-gray-900">{healthProfile.weight}</p>
                  <p className="text-xs text-gray-500">kg</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-gray-900">{healthProfile.height}</p>
                  <p className="text-xs text-gray-500">cm</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className={`text-2xl font-bold ${bmi.color}`}>{healthProfile.bmi}</p>
                  <p className="text-xs text-gray-500">IMC</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${bmi.color} bg-opacity-10`}>
                  {bmi.label}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Objetivo</p>
                <p className="text-sm font-medium text-gray-900">
                  🎯 {HEALTH_GOAL_LABELS[healthProfile.goal]}
                </p>
              </div>

              {healthProfile.dietaryRestrictions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Restrições Alimentares</p>
                  <div className="flex flex-wrap gap-1.5">
                    {healthProfile.dietaryRestrictions.map((r) => (
                      <span
                        key={r}
                        className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-medium"
                      >
                        ⚠️ {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {healthProfile.notes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Observações</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                    {healthProfile.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Peso (kg)</label>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) =>
                      setForm({ ...form, weight: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Altura (cm)</label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) =>
                      setForm({ ...form, height: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Objetivo</label>
                <select
                  value={form.goal}
                  onChange={(e) =>
                    setForm({ ...form, goal: e.target.value as HealthGoal })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  {Object.entries(HEALTH_GOAL_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Restrições Alimentares (separar por vírgula)
                </label>
                <input
                  type="text"
                  value={form.dietaryRestrictions.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dietaryRestrictions: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Ex: Lactose, Glúten"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Observações</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-green-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-700 transition-colors active:scale-[0.98]"
              >
                Salvar Alterações
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full text-center text-sm text-red-500 hover:text-red-600 font-medium py-3"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
