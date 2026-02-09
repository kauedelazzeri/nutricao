import { useState, useRef, useMemo } from "react";
import { useApp } from "~/shared/contexts/AppContext";
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from "~/shared/types";
import type { MealEntry, MealType } from "~/shared/types";
import { formatDate, formatTime, groupMealsByDay } from "~/shared/utils/mealClassifier";

type FilterPeriod = 7 | 14 | 30 | "all";

const FILTER_OPTIONS: { value: FilterPeriod; label: string }[] = [
  { value: 7, label: "7 dias" },
  { value: 14, label: "14 dias" },
  { value: 30, label: "30 dias" },
  { value: "all", label: "Tudo" },
];

export default function TimelinePage() {
  const { meals, addMeal, updateMeal, deleteMeal, currentUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filter, setFilter] = useState<FilterPeriod>(7);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  const userMeals = meals.filter((m) => m.patientId === (currentUser?.id ?? "p1"));

  const filteredMeals = useMemo(() => {
    if (filter === "all") return userMeals;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filter);
    cutoff.setHours(0, 0, 0, 0);
    return userMeals.filter((m) => new Date(m.timestamp) >= cutoff);
  }, [userMeals, filter]);

  const grouped = groupMealsByDay(filteredMeals);
  const days = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addMeal(url);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }
    e.target.value = "";
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 z-40 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">🥗 NutriSnap</h1>
            <p className="text-xs text-gray-500">
              Olá, {currentUser?.name?.split(" ")[0] ?? "Paciente"}!
            </p>
          </div>
          <img
            src={currentUser?.avatar}
            alt=""
            className="w-9 h-9 rounded-full bg-gray-200"
          />
        </div>

        {/* Date filter section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Período</span>
            <span className="text-xs text-gray-400">
              {filteredMeals.length} {filteredMeals.length === 1 ? 'refeição' : 'refeições'}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === opt.value
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-bounce">
          ✅ Refeição registrada!
        </div>
      )}

      {/* Timeline */}
      <div className="px-4 py-4 pb-28 space-y-6">
        {days.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📷</div>
            <p className="text-gray-500 text-sm">
              {filter !== "all"
                ? `Nenhuma refeição nos últimos ${filter} dias.`
                : "Nenhuma refeição registrada ainda."}
              <br />
              Tire uma foto do seu prato!
            </p>
          </div>
        ) : (
          days.map((day) => (
            <div key={day}>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {formatDate(grouped[day][0].timestamp)}
              </h2>
              <div className="space-y-3">
                {grouped[day].map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => setEditingMeal({ ...meal })}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform w-full text-left"
                  >
                    <img
                      src={meal.photoUrl}
                      alt="Refeição"
                      className="w-full h-32 object-cover"
                      loading="lazy"
                    />
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {MEAL_TYPE_ICONS[meal.mealType]}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {MEAL_TYPE_LABELS[meal.mealType]}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTime(meal.timestamp)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-300">Editar →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* FAB - Floating Action Button */}
      <button
        onClick={handleCapture}
        className="fixed bottom-24 right-5 w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center justify-center text-3xl transition-all active:scale-90 z-40"
        aria-label="Registrar refeição"
      >
        +
      </button>

      {/* ==================== Meal Detail / Edit Modal ==================== */}
      {editingMeal && (
        <MealEditModal
          meal={editingMeal}
          onSave={(updated) => {
            updateMeal(updated.id, updated);
            setEditingMeal(null);
          }}
          onDelete={(id) => {
            deleteMeal(id);
            setEditingMeal(null);
          }}
          onClose={() => setEditingMeal(null)}
        />
      )}
    </div>
  );
}

// ==================== Meal Edit Modal Component ====================

function MealEditModal({
  meal,
  onSave,
  onDelete,
  onClose,
}: {
  meal: MealEntry;
  onSave: (meal: MealEntry) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<MealEntry>({ ...meal });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Extract date and time from timestamp for the inputs
  const dateValue = form.timestamp.slice(0, 10); // YYYY-MM-DD
  const timeValue = (() => {
    const d = new Date(form.timestamp);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  })();

  const handleDateChange = (newDate: string) => {
    const current = new Date(form.timestamp);
    const [y, m, d] = newDate.split("-").map(Number);
    current.setFullYear(y, m - 1, d);
    setForm({ ...form, timestamp: current.toISOString() });
  };

  const handleTimeChange = (newTime: string) => {
    const current = new Date(form.timestamp);
    const [h, min] = newTime.split(":").map(Number);
    current.setHours(h, min);
    setForm({ ...form, timestamp: current.toISOString() });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto animate-[slideUp_0.25s_ease-out]">
        {/* Photo */}
        <div className="relative">
          <img
            src={form.photoUrl}
            alt="Refeição"
            className="w-full h-56 object-cover rounded-t-3xl sm:rounded-t-3xl"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-sm hover:bg-black/60 transition-colors"
          >
            ✕
          </button>
          {/* Meal type badge on photo */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <span className="text-base">{MEAL_TYPE_ICONS[form.mealType]}</span>
            <span className="text-xs font-semibold text-gray-800">
              {MEAL_TYPE_LABELS[form.mealType]}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-5">
          <h2 className="text-base font-bold text-gray-900">Detalhes da Refeição</h2>

          {/* Meal type selector */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block font-medium">
              Tipo de Refeição
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(MEAL_TYPE_LABELS) as MealType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setForm({ ...form, mealType: type })}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center ${
                    form.mealType === type
                      ? "border-green-600 bg-green-50"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <span className="text-lg">{MEAL_TYPE_ICONS[type]}</span>
                  <span className="text-[10px] font-medium text-gray-700 leading-tight">
                    {MEAL_TYPE_LABELS[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">
                📅 Data
              </label>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">
                🕐 Horário
              </label>
              <input
                type="time"
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">
              📝 Observações
            </label>
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Ex: Arroz integral, frango grelhado, salada de rúcula..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onSave(form)}
              className="w-full bg-green-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-700 transition-colors active:scale-[0.98]"
            >
              ✅ Salvar Alterações
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-center text-sm text-red-400 hover:text-red-600 font-medium py-2 transition-colors"
              >
                Excluir refeição
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => onDelete(form.id)}
                  className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  🗑️ Confirmar Exclusão
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
