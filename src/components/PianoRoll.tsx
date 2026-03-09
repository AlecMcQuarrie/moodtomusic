"use client";

import { useRef, useEffect, useCallback } from "react";
import { ChordProgression } from "@/lib/musicTheory";

interface PianoRollProps {
  progression: ChordProgression | null;
  activeChordIndex: number;
  isPlaying: boolean;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const BLACK_KEYS = new Set([1, 3, 6, 8, 10]);

function isBlackKey(midi: number): boolean {
  return BLACK_KEYS.has(midi % 12);
}

function noteName(midi: number): string {
  return NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
}

export default function PianoRoll({
  progression,
  activeChordIndex,
  isPlaying,
}: PianoRollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const activeRef = useRef(activeChordIndex);

  activeRef.current = activeChordIndex;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !progression) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Determine note range
    const allMidi = progression.chords.flatMap((c) => c.midiNotes);
    const minNote = Math.min(...allMidi) - 2;
    const maxNote = Math.max(...allMidi) + 2;
    const noteRange = maxNote - minNote + 1;

    const keyLabelWidth = 44;
    const rollWidth = width - keyLabelWidth;
    const rowHeight = Math.max(Math.floor(height / noteRange), 12);
    const actualHeight = rowHeight * noteRange;

    const totalBeats = progression.totalBeats;
    const pxPerBeat = rollWidth / totalBeats;

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);

    const yOffset = Math.max(0, (height - actualHeight) / 2);

    // Draw rows (piano key labels)
    for (let n = maxNote; n >= minNote; n--) {
      const row = maxNote - n;
      const y = yOffset + row * rowHeight;
      const isBlack = isBlackKey(n);

      ctx.fillStyle = isBlack
        ? "rgba(255,255,255,0.015)"
        : "rgba(255,255,255,0.03)";
      ctx.fillRect(keyLabelWidth, y, rollWidth, rowHeight);

      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(keyLabelWidth, y + rowHeight - 0.5, rollWidth, 0.5);

      ctx.fillStyle = isBlack
        ? "rgba(255,255,255,0.2)"
        : "rgba(255,255,255,0.35)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.textAlign = "right";
      ctx.fillText(noteName(n), keyLabelWidth - 6, y + rowHeight / 2 + 3.5);
    }

    // Key label separator
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(keyLabelWidth, yOffset, 1, actualHeight);

    // Draw bar lines
    const totalBars = totalBeats / 4;
    for (let bar = 1; bar < totalBars; bar++) {
      const x = keyLabelWidth + bar * 4 * pxPerBeat;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(x, yOffset, 0.5, actualHeight);
    }

    // Draw beat subdivisions
    for (let beat = 0; beat < totalBeats; beat++) {
      if (beat % 4 === 0) continue; // skip bar lines
      const x = keyLabelWidth + beat * pxPerBeat;
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      ctx.fillRect(x, yOffset, 0.5, actualHeight);
    }

    // Draw chord regions and notes
    let beatOffset = 0;
    for (let i = 0; i < progression.chords.length; i++) {
      const chord = progression.chords[i];
      const chordX = keyLabelWidth + beatOffset * pxPerBeat;
      const chordWidth = chord.durationBeats * pxPerBeat;
      const isActive = i === activeRef.current && isPlaying;

      // Chord boundary line
      if (i > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(chordX, yOffset, 0.5, actualHeight);
      }

      // Active column highlight
      if (isActive) {
        ctx.fillStyle = "rgba(255,255,255,0.02)";
        ctx.fillRect(chordX, yOffset, chordWidth, actualHeight);
      }

      // Notes
      const noteGap = 2;
      const noteWidth = chordWidth - noteGap * 2;

      for (const midi of chord.midiNotes) {
        if (midi < minNote || midi > maxNote) continue;
        const row = maxNote - midi;
        const y = yOffset + row * rowHeight;

        const noteX = chordX + noteGap;
        const noteY = y + 1;
        const noteH = rowHeight - 2;

        if (isActive) {
          const gradient = ctx.createLinearGradient(
            noteX, noteY, noteX + noteWidth, noteY
          );
          gradient.addColorStop(0, "rgba(255,255,255,0.85)");
          gradient.addColorStop(1, "rgba(200,210,255,0.75)");
          ctx.fillStyle = gradient;

          ctx.shadowColor = "rgba(180,200,255,0.5)";
          ctx.shadowBlur = 12;
          roundRect(ctx, noteX, noteY, noteWidth, noteH, 4);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          roundRect(ctx, noteX, noteY, noteWidth, noteH, 4);
          ctx.fill();
        }
      }

      beatOffset += chord.durationBeats;
    }
  }, [progression, isPlaying]);

  useEffect(() => {
    function loop() {
      draw();
      animationRef.current = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => observer.disconnect();
  }, [draw]);

  if (!progression) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] h-64 flex items-center justify-center">
        <p className="text-sm text-neutral-600">
          Select a mood and generate a progression to see the piano roll
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-white/[0.06] bg-neutral-950 overflow-hidden"
      style={{ height: 280 }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
