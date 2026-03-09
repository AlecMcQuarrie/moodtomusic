"use client";

import { ChordProgression } from "@/lib/musicTheory";

interface ChordDisplayProps {
  progression: ChordProgression;
  activeChordIndex: number;
}

export default function ChordDisplay({
  progression,
  activeChordIndex,
}: ChordDisplayProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-sm font-medium text-neutral-400">
          {progression.name}
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-neutral-500">
          {progression.key} {progression.mode}
        </span>
      </div>
      <div className="flex gap-2.5">
        {progression.chords.map((chord, i) => {
          const isActive = i === activeChordIndex;
          return (
            <div
              key={i}
              className="flex-1 rounded-xl border p-4 transition-all duration-300 text-center"
              style={{
                backgroundColor: isActive
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.02)",
                borderColor: isActive
                  ? "rgba(255,255,255,0.20)"
                  : "rgba(255,255,255,0.06)",
                transform: isActive ? "scale(1.02)" : "scale(1)",
                boxShadow: isActive
                  ? "0 4px 24px rgba(0,0,0,0.3)"
                  : "none",
              }}
            >
              <p
                className="text-lg font-semibold transition-colors duration-300"
                style={{
                  color: isActive
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.5)",
                }}
              >
                {chord.label}
              </p>
              <p
                className="text-xs mt-1 font-mono transition-colors duration-300"
                style={{
                  color: isActive
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.25)",
                }}
              >
                {chord.romanNumeral}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
