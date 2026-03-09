"use client";

import { NoteName, KEY_OPTIONS } from "@/lib/musicTheory";

interface ControlsProps {
  selectedKey: NoteName;
  bpm: number;
  onKeyChange: (key: NoteName) => void;
  onBpmChange: (bpm: number) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onRegenerate: () => void;
  hasProgression: boolean;
}

export default function Controls({
  selectedKey,
  bpm,
  onKeyChange,
  onBpmChange,
  isPlaying,
  onPlay,
  onStop,
  onRegenerate,
  hasProgression,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Key selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium uppercase tracking-widest text-neutral-500">
          Key
        </label>
        <select
          value={selectedKey}
          onChange={(e) => onKeyChange(e.target.value as NoteName)}
          className="appearance-none rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
        >
          {KEY_OPTIONS.map((k) => (
            <option key={k} value={k} className="bg-neutral-900">
              {k}
            </option>
          ))}
        </select>
      </div>

      {/* BPM */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium uppercase tracking-widest text-neutral-500">
          BPM
        </label>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onBpmChange(Math.max(40, bpm - 5))}
            className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.08] transition-colors text-xs font-bold"
          >
            −
          </button>
          <input
            type="number"
            value={bpm}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v >= 40 && v <= 240) onBpmChange(v);
            }}
            className="w-14 text-center rounded-lg bg-white/[0.04] border border-white/[0.08] px-2 py-1.5 text-sm text-neutral-200 focus:outline-none focus:border-white/20 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => onBpmChange(Math.min(240, bpm + 5))}
            className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.08] transition-colors text-xs font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      {hasProgression && (
        <button
          onClick={onRegenerate}
          className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 border border-white/[0.08] hover:text-neutral-200 hover:bg-white/[0.06] transition-all duration-200"
        >
          <span className="mr-1.5">↻</span>
          Regenerate
        </button>
      )}

      {hasProgression && (
        <button
          onClick={isPlaying ? onStop : onPlay}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
            isPlaying
              ? "bg-white/10 text-white border border-white/20 hover:bg-white/15"
              : "bg-white text-neutral-950 hover:bg-neutral-200"
          }`}
        >
          {isPlaying ? "■ Stop" : "▶ Play"}
        </button>
      )}
    </div>
  );
}
