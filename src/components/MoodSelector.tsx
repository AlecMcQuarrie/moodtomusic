"use client";

import { Mood } from "@/lib/musicTheory";

interface MoodSelectorProps {
  moods: Mood[];
  selectedMoods: string[];
  onToggleMood: (moodId: string) => void;
}

export default function MoodSelector({
  moods,
  selectedMoods,
  onToggleMood,
}: MoodSelectorProps) {
  const categories = [
    { key: "positive" as const, label: "Positive" },
    { key: "neutral" as const, label: "Neutral" },
    { key: "negative" as const, label: "Somber" },
    { key: "intense" as const, label: "Intense" },
  ];

  return (
    <div className="space-y-5">
      {categories.map((cat) => {
        const catMoods = moods.filter((m) => m.category === cat.key);
        if (catMoods.length === 0) return null;

        return (
          <div key={cat.key}>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2.5">
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {catMoods.map((mood) => {
                const isSelected = selectedMoods.includes(mood.id);
                return (
                  <button
                    key={mood.id}
                    onClick={() => onToggleMood(mood.id)}
                    className="group relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: isSelected
                        ? mood.color + "18"
                        : "transparent",
                      border: `1.5px solid ${isSelected ? mood.color + "60" : "rgba(255,255,255,0.08)"}`,
                      color: isSelected ? mood.color : "rgba(255,255,255,0.55)",
                      boxShadow: isSelected
                        ? `0 0 20px ${mood.color}15`
                        : "none",
                    }}
                  >
                    <span className="mr-1.5">{mood.emoji}</span>
                    {mood.name}
                    {isSelected && (
                      <span
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: mood.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
