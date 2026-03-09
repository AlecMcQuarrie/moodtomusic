"use client";

import { useState, useCallback, useRef } from "react";
import {
  MOODS,
  generateProgression,
  transposeProgression,
  ChordProgression,
  NoteName,
} from "@/lib/musicTheory";
import {
  playProgression,
  stopPlayback,
  startAudioContext,
  setBpm,
} from "@/lib/audioEngine";
import MoodSelector from "@/components/MoodSelector";
import Controls from "@/components/Controls";
import ChordDisplay from "@/components/ChordDisplay";
import PianoRoll from "@/components/PianoRoll";

export default function Home() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<NoteName>("C");
  const [bpm, setBpmState] = useState(100);
  const [progression, setProgression] = useState<ChordProgression | null>(null);
  const [activeChordIndex, setActiveChordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressionRef = useRef<ChordProgression | null>(null);

  const toggleMood = useCallback((moodId: string) => {
    setSelectedMoods((prev) =>
      prev.includes(moodId)
        ? prev.filter((id) => id !== moodId)
        : prev.length >= 2
          ? [prev[1], moodId]
          : [...prev, moodId]
    );
  }, []);

  const generate = useCallback(() => {
    if (selectedMoods.length === 0) return;
    stopPlayback();
    setIsPlaying(false);
    setActiveChordIndex(-1);

    const moodId = selectedMoods[Math.floor(Math.random() * selectedMoods.length)];
    const prog = generateProgression(moodId, selectedKey);
    setProgression(prog);
    progressionRef.current = prog;
  }, [selectedMoods, selectedKey]);

  const handlePlay = useCallback(async () => {
    const prog = progressionRef.current;
    if (!prog) return;

    await startAudioContext();
    setIsPlaying(true);
    setActiveChordIndex(0);

    playProgression(prog, bpm, {
      onChordChange: (index) => setActiveChordIndex(index),
      onStop: () => {
        setIsPlaying(false);
        setActiveChordIndex(-1);
      },
    });
  }, [bpm]);

  const handleStop = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
    setActiveChordIndex(-1);
  }, []);

  const handleBpmChange = useCallback(
    (newBpm: number) => {
      setBpmState(newBpm);
      if (isPlaying) {
        setBpm(newBpm);
      }
    },
    [isPlaying]
  );

  const handleKeyChange = useCallback(
    (key: NoteName) => {
      setSelectedKey(key);
      if (progression) {
        const wasPlaying = isPlaying;
        stopPlayback();
        setIsPlaying(false);
        setActiveChordIndex(-1);

        const transposed = transposeProgression(progression, key);
        setProgression(transposed);
        progressionRef.current = transposed;

        // Restart playback if it was playing
        if (wasPlaying) {
          startAudioContext().then(() => {
            setIsPlaying(true);
            setActiveChordIndex(0);
            playProgression(transposed, bpm, {
              onChordChange: (index) => setActiveChordIndex(index),
              onStop: () => {
                setIsPlaying(false);
                setActiveChordIndex(-1);
              },
            });
          });
        }
      }
    },
    [progression, isPlaying, bpm]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              MoodToMusic
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Emotion-driven chord progressions
            </p>
          </div>
          <div className="text-xs text-neutral-600 font-mono">
            {progression
              ? `${progression.chords.length} chords · ${progression.totalBeats / 4} bars · ${progression.mode}`
              : "Select a mood to begin"}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Mood Selection */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-neutral-300">
              How are you feeling?
            </h2>
            {selectedMoods.length > 0 && (
              <span className="text-xs text-neutral-600">
                {selectedMoods.length}/2 selected
              </span>
            )}
          </div>
          <MoodSelector
            moods={MOODS}
            selectedMoods={selectedMoods}
            onToggleMood={toggleMood}
          />
        </section>

        {/* Generate Button */}
        {selectedMoods.length > 0 && !progression && (
          <div className="flex justify-center">
            <button
              onClick={generate}
              className="rounded-xl bg-white text-neutral-950 px-8 py-3 text-sm font-semibold hover:bg-neutral-200 transition-colors duration-200"
            >
              Generate Progression
            </button>
          </div>
        )}

        {/* Results */}
        {progression && (
          <>
            {/* Controls */}
            <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <Controls
                selectedKey={selectedKey}
                bpm={bpm}
                onKeyChange={handleKeyChange}
                onBpmChange={handleBpmChange}
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onStop={handleStop}
                onRegenerate={generate}
                hasProgression={!!progression}
              />
            </section>

            {/* Chord Cards */}
            <section>
              <ChordDisplay
                progression={progression}
                activeChordIndex={activeChordIndex}
              />
            </section>

            {/* Piano Roll */}
            <section>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-3">
                Piano Roll
              </p>
              <PianoRoll
                progression={progression}
                activeChordIndex={activeChordIndex}
                isPlaying={isPlaying}
              />
            </section>

            {/* Chord Details */}
            <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-3">
                Progression Details
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mood</span>
                  <span className="text-neutral-300">{progression.mood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Key / Mode</span>
                  <span className="text-neutral-300">
                    {progression.key} {progression.mode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Length</span>
                  <span className="text-neutral-300">
                    {progression.totalBeats / 4} bars · {progression.chords.length} chords
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Progression</span>
                  <span className="text-neutral-300 font-mono text-xs">
                    {progression.chords.map((c) => c.romanNumeral).join(" → ")}
                  </span>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-neutral-700">
            Built with real music theory — scales, modes, and voice leading
          </p>
          <p className="text-xs text-neutral-700 font-mono">v0.4.0</p>
        </div>
      </footer>
    </div>
  );
}
