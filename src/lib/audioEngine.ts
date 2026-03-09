import * as Tone from "tone";
import { ChordProgression, midiToNoteName } from "./musicTheory";

let synth: Tone.PolySynth | null = null;
let reverb: Tone.Reverb | null = null;
let chorus: Tone.Chorus | null = null;
let compressor: Tone.Compressor | null = null;

function ensureSynth() {
  if (synth) return synth;

  compressor = new Tone.Compressor(-20, 4).toDestination();
  reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).connect(compressor);
  chorus = new Tone.Chorus({ frequency: 0.5, delayTime: 3.5, depth: 0.7, wet: 0.2 }).connect(reverb);

  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "fatsawtooth", count: 3, spread: 20 },
    envelope: { attack: 0.08, decay: 0.3, sustain: 0.6, release: 1.2 },
    volume: -10,
  }).connect(chorus);

  return synth;
}

export interface PlaybackCallbacks {
  onChordChange: (chordIndex: number) => void;
  onStop: () => void;
}

let currentPart: Tone.Part | null = null;
let isPlaying = false;

export async function startAudioContext() {
  await Tone.start();
}

interface ChordEvent {
  time: string;
  chordIndex: number;
  notes: string[];
  durationBeats: number;
}

export function playProgression(
  progression: ChordProgression,
  bpm: number,
  callbacks: PlaybackCallbacks
) {
  stopPlayback();

  const s = ensureSynth();
  Tone.getTransport().bpm.value = bpm;

  const events: ChordEvent[] = [];
  let beatOffset = 0;

  progression.chords.forEach((chord, i) => {
    const notes = chord.midiNotes.map(midiToNoteName);
    events.push({
      time: `0:${beatOffset}:0`,
      chordIndex: i,
      notes,
      durationBeats: chord.durationBeats,
    });
    beatOffset += chord.durationBeats;
  });

  const totalBars = progression.totalBeats / 4;

  currentPart = new Tone.Part<ChordEvent>(
    (time, event) => {
      s.triggerAttackRelease(
        event.notes,
        `0:${event.durationBeats}:0`,
        time,
        0.7
      );
      Tone.getDraw().schedule(() => {
        callbacks.onChordChange(event.chordIndex);
      }, time);
    },
    events
  );

  currentPart.loop = true;
  currentPart.loopEnd = `${totalBars}:0:0`;
  currentPart.start(0);

  Tone.getTransport().start();
  isPlaying = true;
}

export function stopPlayback() {
  if (currentPart) {
    currentPart.stop();
    currentPart.dispose();
    currentPart = null;
  }
  Tone.getTransport().stop();
  Tone.getTransport().position = 0;
  isPlaying = false;
}

export function getIsPlaying() {
  return isPlaying;
}

export function setBpm(bpm: number) {
  Tone.getTransport().bpm.value = bpm;
}
