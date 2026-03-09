// ── Core types ───────────────────────────────────────────────────────

export type NoteName =
  | "C" | "C#" | "D" | "D#" | "E" | "F"
  | "F#" | "G" | "G#" | "A" | "A#" | "B";

export type ChordQuality =
  | "maj" | "min" | "dim" | "aug"
  | "maj7" | "min7" | "dom7" | "dim7" | "min7b5"
  | "sus2" | "sus4"
  | "add9" | "min9" | "maj9" | "dom9";

export type HarmonicFunction = "tonic" | "subdominant" | "dominant" | "predominant";

export type ModeName = "major" | "minor" | "dorian" | "mixolydian" | "phrygian" | "lydian";

export interface Chord {
  root: NoteName;
  quality: ChordQuality;
  midiNotes: number[];
  label: string;
  romanNumeral: string;
  durationBeats: number;
  function: HarmonicFunction;
  inversion: number;
  bassNote?: NoteName;
}

export interface ChordProgression {
  chords: Chord[];
  key: NoteName;
  mode: ModeName;
  mood: string;
  totalBeats: number;
}

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  category: "positive" | "negative" | "neutral" | "intense";
}

// ── Constants ────────────────────────────────────────────────────────

const ALL_NOTES: NoteName[] = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
  min7b5: [0, 3, 6, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  add9: [0, 4, 7, 14],
  min9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  dom9: [0, 4, 7, 10, 14],
};

const SCALE_INTERVALS: Record<ModeName, number[]> = {
  major:      [0, 2, 4, 5, 7, 9, 11],
  minor:      [0, 2, 3, 5, 7, 8, 10],
  dorian:     [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  phrygian:   [0, 1, 3, 5, 7, 8, 10],
  lydian:     [0, 2, 4, 6, 7, 9, 11],
};

const QUALITY_LABELS: Record<ChordQuality, string> = {
  maj: "", min: "m", dim: "°", aug: "+",
  maj7: "maj7", min7: "m7", dom7: "7", dim7: "°7",
  min7b5: "ø7", sus2: "sus2", sus4: "sus4",
  add9: "add9", min9: "m9", maj9: "maj9", dom9: "9",
};

// Valid targets for secondary dominants (scale degrees 0-indexed).
// Only major/minor chords on ii, IV, V, vi are standard tonicization targets.
const VALID_SEC_DOM_TARGETS = new Set([1, 3, 4, 5]);

// Sus chords only make musical sense on these scale degrees (I and IV).
const VALID_SUS_DEGREES = new Set([0, 3]);

// ── Scale degree definitions per mode ────────────────────────────────

interface ScaleDegreeInfo {
  quality: ChordQuality;
  roman: string;
  function: HarmonicFunction;
}

const MAJOR_DEGREES: ScaleDegreeInfo[] = [
  { quality: "maj", roman: "I",    function: "tonic" },
  { quality: "min", roman: "ii",   function: "predominant" },
  { quality: "min", roman: "iii",  function: "tonic" },
  { quality: "maj", roman: "IV",   function: "subdominant" },
  { quality: "maj", roman: "V",    function: "dominant" },
  { quality: "min", roman: "vi",   function: "tonic" },
  { quality: "dim", roman: "vii°", function: "dominant" },
];

const MINOR_DEGREES: ScaleDegreeInfo[] = [
  { quality: "min", roman: "i",    function: "tonic" },
  { quality: "dim", roman: "ii°",  function: "predominant" },
  { quality: "maj", roman: "III",  function: "tonic" },
  { quality: "min", roman: "iv",   function: "subdominant" },
  { quality: "min", roman: "v",    function: "dominant" },
  { quality: "maj", roman: "VI",   function: "subdominant" },
  { quality: "maj", roman: "VII",  function: "dominant" },
];

const DORIAN_DEGREES: ScaleDegreeInfo[] = [
  { quality: "min", roman: "i",    function: "tonic" },
  { quality: "min", roman: "ii",   function: "predominant" },
  { quality: "maj", roman: "III",  function: "tonic" },
  { quality: "maj", roman: "IV",   function: "subdominant" },
  { quality: "min", roman: "v",    function: "dominant" },
  { quality: "dim", roman: "vi°",  function: "subdominant" },
  { quality: "maj", roman: "VII",  function: "dominant" },
];

const MIXOLYDIAN_DEGREES: ScaleDegreeInfo[] = [
  { quality: "maj", roman: "I",    function: "tonic" },
  { quality: "min", roman: "ii",   function: "predominant" },
  { quality: "dim", roman: "iii°", function: "dominant" },
  { quality: "maj", roman: "IV",   function: "subdominant" },
  { quality: "min", roman: "v",    function: "dominant" },
  { quality: "min", roman: "vi",   function: "tonic" },
  { quality: "maj", roman: "♭VII", function: "subdominant" },
];

const PHRYGIAN_DEGREES: ScaleDegreeInfo[] = [
  { quality: "min", roman: "i",    function: "tonic" },
  { quality: "maj", roman: "♭II",  function: "subdominant" },
  { quality: "maj", roman: "III",  function: "tonic" },
  { quality: "min", roman: "iv",   function: "subdominant" },
  { quality: "dim", roman: "v°",   function: "dominant" },
  { quality: "maj", roman: "♭VI",  function: "subdominant" },
  { quality: "min", roman: "♭vii", function: "dominant" },
];

const LYDIAN_DEGREES: ScaleDegreeInfo[] = [
  { quality: "maj", roman: "I",    function: "tonic" },
  { quality: "maj", roman: "II",   function: "subdominant" },
  { quality: "min", roman: "iii",  function: "tonic" },
  { quality: "aug", roman: "IV+",  function: "subdominant" },
  { quality: "maj", roman: "V",    function: "dominant" },
  { quality: "min", roman: "vi",   function: "tonic" },
  { quality: "dim", roman: "vii°", function: "dominant" },
];

const MODE_DEGREES: Record<ModeName, ScaleDegreeInfo[]> = {
  major: MAJOR_DEGREES, minor: MINOR_DEGREES, dorian: DORIAN_DEGREES,
  mixolydian: MIXOLYDIAN_DEGREES, phrygian: PHRYGIAN_DEGREES, lydian: LYDIAN_DEGREES,
};

// ── Harmonic function transitions ────────────────────────────────────

type TransitionMap = Record<HarmonicFunction, HarmonicFunction[]>;

const STANDARD_TRANSITIONS: TransitionMap = {
  tonic:        ["subdominant", "predominant", "dominant", "tonic"],
  subdominant:  ["dominant", "tonic", "predominant"],
  predominant:  ["dominant", "subdominant"],
  dominant:     ["tonic", "subdominant"],
};

// ── Mood profiles ────────────────────────────────────────────────────

interface MoodProfile {
  modes: ModeName[];
  modeWeights: number[];
  extensionChance: number;
  susChance: number;
  chromaticChance: number;
  secondaryDominantChance: number;
  tritoneSubChance: number;
  inversionChance: number;
  pedalBassChance: number;
  phraseLengths: number[];
  phraseWeights: number[];
  looseTransitions: boolean;
  preferredCadence: "authentic" | "plagal" | "deceptive" | "half" | "mixed";
  rhythmStyle: "even" | "varied" | "halves";
  startDegrees: number[];
  startWeights: number[];
}

const MOOD_PROFILES: Record<string, MoodProfile> = {
  joyful: {
    modes: ["major", "lydian", "mixolydian"], modeWeights: [5, 2, 2],
    extensionChance: 0.25, susChance: 0.05, chromaticChance: 0.1,
    secondaryDominantChance: 0.15, tritoneSubChance: 0.0,
    inversionChance: 0.25, pedalBassChance: 0.0,
    phraseLengths: [16, 32], phraseWeights: [3, 1],
    looseTransitions: false, preferredCadence: "authentic", rhythmStyle: "even",
    startDegrees: [0, 3, 4, 5], startWeights: [4, 2, 2, 1],
  },
  peaceful: {
    modes: ["major", "lydian"], modeWeights: [3, 2],
    extensionChance: 0.6, susChance: 0.3, chromaticChance: 0.05,
    secondaryDominantChance: 0.05, tritoneSubChance: 0.0,
    inversionChance: 0.35, pedalBassChance: 0.25,
    phraseLengths: [16, 32], phraseWeights: [2, 3],
    looseTransitions: false, preferredCadence: "plagal", rhythmStyle: "varied",
    startDegrees: [0, 3, 5, 2], startWeights: [3, 3, 2, 1],
  },
  romantic: {
    modes: ["major", "dorian", "mixolydian"], modeWeights: [5, 2, 1],
    extensionChance: 0.55, susChance: 0.1, chromaticChance: 0.15,
    secondaryDominantChance: 0.2, tritoneSubChance: 0.1,
    inversionChance: 0.4, pedalBassChance: 0.15,
    phraseLengths: [16, 32], phraseWeights: [2, 3],
    looseTransitions: false, preferredCadence: "mixed", rhythmStyle: "varied",
    startDegrees: [0, 5, 1, 3], startWeights: [3, 3, 2, 2],
  },
  triumphant: {
    modes: ["major", "mixolydian"], modeWeights: [4, 2],
    extensionChance: 0.1, susChance: 0.05, chromaticChance: 0.1,
    secondaryDominantChance: 0.15, tritoneSubChance: 0.0,
    inversionChance: 0.2, pedalBassChance: 0.0,
    phraseLengths: [16, 32], phraseWeights: [2, 3],
    looseTransitions: false, preferredCadence: "authentic", rhythmStyle: "even",
    startDegrees: [0, 3, 4], startWeights: [3, 3, 2],
  },
  nostalgic: {
    modes: ["major", "minor", "dorian"], modeWeights: [3, 3, 2],
    extensionChance: 0.45, susChance: 0.1, chromaticChance: 0.15,
    secondaryDominantChance: 0.15, tritoneSubChance: 0.1,
    inversionChance: 0.35, pedalBassChance: 0.1,
    phraseLengths: [16, 32], phraseWeights: [2, 2],
    looseTransitions: false, preferredCadence: "deceptive", rhythmStyle: "varied",
    startDegrees: [0, 5, 3, 1], startWeights: [2, 3, 2, 1],
  },
  dreamy: {
    modes: ["lydian", "major"], modeWeights: [3, 2],
    extensionChance: 0.7, susChance: 0.35, chromaticChance: 0.1,
    secondaryDominantChance: 0.1, tritoneSubChance: 0.05,
    inversionChance: 0.45, pedalBassChance: 0.3,
    phraseLengths: [16, 32], phraseWeights: [1, 3],
    looseTransitions: false, preferredCadence: "plagal", rhythmStyle: "varied",
    startDegrees: [0, 3, 2, 5], startWeights: [2, 3, 2, 2],
  },
  mysterious: {
    modes: ["phrygian", "minor"], modeWeights: [3, 2],
    extensionChance: 0.4, susChance: 0.1, chromaticChance: 0.2,
    secondaryDominantChance: 0.1, tritoneSubChance: 0.15,
    inversionChance: 0.3, pedalBassChance: 0.2,
    phraseLengths: [16, 32], phraseWeights: [3, 2],
    looseTransitions: false, preferredCadence: "half", rhythmStyle: "varied",
    startDegrees: [0, 1, 5, 3], startWeights: [2, 3, 2, 2],
  },
  melancholic: {
    modes: ["minor", "dorian", "major"], modeWeights: [4, 2, 1],
    extensionChance: 0.5, susChance: 0.15, chromaticChance: 0.15,
    secondaryDominantChance: 0.12, tritoneSubChance: 0.08,
    inversionChance: 0.35, pedalBassChance: 0.15,
    phraseLengths: [16, 32], phraseWeights: [2, 3],
    looseTransitions: false, preferredCadence: "plagal", rhythmStyle: "varied",
    startDegrees: [0, 5, 3, 6], startWeights: [2, 3, 2, 1],
  },
  anxious: {
    modes: ["minor", "phrygian"], modeWeights: [3, 2],
    extensionChance: 0.35, susChance: 0.05, chromaticChance: 0.25,
    secondaryDominantChance: 0.15, tritoneSubChance: 0.2,
    inversionChance: 0.3, pedalBassChance: 0.1,
    phraseLengths: [16], phraseWeights: [1],
    looseTransitions: false, preferredCadence: "half", rhythmStyle: "halves",
    startDegrees: [0, 4, 1, 6], startWeights: [2, 2, 2, 1],
  },
  angry: {
    modes: ["minor", "phrygian"], modeWeights: [3, 3],
    extensionChance: 0.15, susChance: 0.0, chromaticChance: 0.2,
    secondaryDominantChance: 0.1, tritoneSubChance: 0.1,
    inversionChance: 0.15, pedalBassChance: 0.0,
    phraseLengths: [16], phraseWeights: [1],
    looseTransitions: false, preferredCadence: "half", rhythmStyle: "even",
    startDegrees: [0, 4, 1, 6], startWeights: [2, 2, 2, 2],
  },
  hopeful: {
    modes: ["major", "mixolydian", "lydian"], modeWeights: [4, 2, 1],
    extensionChance: 0.35, susChance: 0.15, chromaticChance: 0.1,
    secondaryDominantChance: 0.12, tritoneSubChance: 0.0,
    inversionChance: 0.3, pedalBassChance: 0.1,
    phraseLengths: [16, 32], phraseWeights: [3, 2],
    looseTransitions: false, preferredCadence: "authentic", rhythmStyle: "varied",
    startDegrees: [0, 3, 5, 1], startWeights: [3, 3, 1, 1],
  },
  contemplative: {
    modes: ["dorian", "major", "minor"], modeWeights: [3, 2, 2],
    extensionChance: 0.6, susChance: 0.2, chromaticChance: 0.1,
    secondaryDominantChance: 0.1, tritoneSubChance: 0.08,
    inversionChance: 0.4, pedalBassChance: 0.2,
    phraseLengths: [16, 32], phraseWeights: [1, 3],
    looseTransitions: false, preferredCadence: "plagal", rhythmStyle: "varied",
    startDegrees: [0, 1, 3, 5], startWeights: [2, 2, 2, 2],
  },
};

// ── Moods ────────────────────────────────────────────────────────────

export const MOODS: Mood[] = [
  { id: "joyful",        name: "Joyful",        emoji: "☀️",  description: "Bright and uplifting",   color: "#F59E0B", category: "positive" },
  { id: "peaceful",      name: "Peaceful",      emoji: "🌿",  description: "Calm and serene",        color: "#10B981", category: "positive" },
  { id: "romantic",      name: "Romantic",       emoji: "🌹",  description: "Warm and tender",        color: "#EC4899", category: "positive" },
  { id: "triumphant",    name: "Triumphant",     emoji: "⚡",  description: "Victorious and powerful", color: "#F97316", category: "positive" },
  { id: "nostalgic",     name: "Nostalgic",      emoji: "🌅",  description: "Bittersweet memories",   color: "#8B5CF6", category: "neutral" },
  { id: "dreamy",        name: "Dreamy",         emoji: "☁️",  description: "Floating and ethereal",  color: "#6366F1", category: "neutral" },
  { id: "mysterious",    name: "Mysterious",     emoji: "🌙",  description: "Enigmatic and curious",  color: "#7C3AED", category: "neutral" },
  { id: "melancholic",   name: "Melancholic",    emoji: "🌧️",  description: "Gentle sadness",         color: "#6B7280", category: "negative" },
  { id: "anxious",       name: "Anxious",        emoji: "💫",  description: "Tense and unsettled",    color: "#EF4444", category: "intense" },
  { id: "angry",         name: "Angry",          emoji: "🔥",  description: "Fierce and aggressive",  color: "#DC2626", category: "intense" },
  { id: "hopeful",       name: "Hopeful",        emoji: "🌱",  description: "Gently optimistic",      color: "#14B8A6", category: "positive" },
  { id: "contemplative", name: "Contemplative",  emoji: "🔮",  description: "Deep in thought",        color: "#8B5CF6", category: "neutral" },
];

// ── Utility functions ────────────────────────────────────────────────

function noteToMidi(note: NoteName, octave: number): number {
  return ALL_NOTES.indexOf(note) + (octave + 1) * 12;
}

function transposeNote(root: NoteName, semitones: number): NoteName {
  const idx = ALL_NOTES.indexOf(root);
  return ALL_NOTES[(idx + ((semitones % 12) + 12) % 12) % 12];
}

function semitoneDiff(a: NoteName, b: NoteName): number {
  return ((ALL_NOTES.indexOf(b) - ALL_NOTES.indexOf(a)) + 12) % 12;
}

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Chord voicing & inversions ───────────────────────────────────────

function voiceChord(
  rootMidi: number,
  intervals: number[],
  inversion: number,
  bassOverrideMidi?: number,
): number[] {
  let notes = intervals.map((i) => rootMidi + i);

  const maxInversion = Math.min(inversion, notes.length - 1);
  for (let inv = 0; inv < maxInversion; inv++) {
    notes[inv] += 12;
  }
  notes.sort((a, b) => a - b);

  if (bassOverrideMidi !== undefined) {
    let bass = bassOverrideMidi;
    while (bass >= notes[0]) bass -= 12;
    if (bass < 36) bass += 12;
    notes = [bass, ...notes];
  }

  return notes;
}

// ── Chord building ───────────────────────────────────────────────────

function buildChord(
  root: NoteName,
  quality: ChordQuality,
  roman: string,
  harmonicFn: HarmonicFunction,
  durationBeats: number,
  inversion: number,
  bassNote?: NoteName,
  octave: number = 4,
): Chord {
  const intervals = CHORD_INTERVALS[quality];
  const rootMidi = noteToMidi(root, octave);
  const bassOverrideMidi = bassNote ? noteToMidi(bassNote, 3) : undefined;
  const midiNotes = voiceChord(rootMidi, intervals, inversion, bassOverrideMidi);

  let label = `${root}${QUALITY_LABELS[quality]}`;

  if (bassNote && bassNote !== root) {
    label += `/${bassNote}`;
  } else if (inversion > 0) {
    const invBassInterval = intervals[inversion] ?? intervals[0];
    const invBass = transposeNote(root, invBassInterval);
    if (invBass !== root) label += `/${invBass}`;
  }

  if (durationBeats === 2) label += " (½)";

  return {
    root, quality, midiNotes, label,
    romanNumeral: roman,
    durationBeats,
    function: harmonicFn,
    inversion,
    bassNote,
  };
}

function buildChordFromDegree(
  key: NoteName, mode: ModeName, degree: number,
  quality: ChordQuality, roman: string, harmonicFn: HarmonicFunction,
  durationBeats: number, inversion: number = 0, bassNote?: NoteName,
): Chord {
  const root = transposeNote(key, SCALE_INTERVALS[mode][degree]);
  return buildChord(root, quality, roman, harmonicFn, durationBeats, inversion, bassNote);
}

// ── Extension / quality upgrading ────────────────────────────────────
// Sus chords are now gated by degree (only I and IV).

function maybeExtend(
  baseQuality: ChordQuality,
  extensionChance: number,
  susChance: number,
  harmonicFn: HarmonicFunction,
  degree: number,
): { quality: ChordQuality; romanSuffix: string } {
  // Sus chords only on I (degree 0) and IV (degree 3)
  if (VALID_SUS_DEGREES.has(degree) && harmonicFn !== "dominant" && Math.random() < susChance) {
    const sus = Math.random() < 0.5 ? "sus2" : "sus4";
    return { quality: sus, romanSuffix: sus };
  }

  if (Math.random() > extensionChance) {
    return { quality: baseQuality, romanSuffix: "" };
  }

  const use9th = Math.random() < 0.25;

  if (baseQuality === "maj") {
    if (use9th) return { quality: "maj9", romanSuffix: "maj9" };
    return { quality: "maj7", romanSuffix: "maj7" };
  }
  if (baseQuality === "min") {
    if (use9th) return { quality: "min9", romanSuffix: "m9" };
    return { quality: "min7", romanSuffix: "m7" };
  }
  if (baseQuality === "dim") {
    return { quality: "min7b5", romanSuffix: "ø7" };
  }

  return { quality: baseQuality, romanSuffix: "" };
}

// ── Inversion selection (voice-leading aware) ────────────────────────

function chooseInversion(
  quality: ChordQuality,
  inversionChance: number,
  prevBassNote?: NoteName,
  chordRoot?: NoteName,
): number {
  if (Math.random() > inversionChance) return 0;

  const intervals = CHORD_INTERVALS[quality];
  // Triads: up to 2nd inversion. 7ths: up to 3rd. But limit to 2 max
  // to keep voicings grounded.
  const maxInv = Math.min(intervals.length - 1, 2);

  if (!prevBassNote || !chordRoot) {
    // First chord — prefer root or 1st inversion, not 2nd
    return Math.random() < 0.7 ? 0 : 1;
  }

  let bestInv = 0;
  let bestDistance = 99;

  for (let inv = 0; inv <= maxInv; inv++) {
    const bassInterval = intervals[inv] ?? 0;
    const bass = transposeNote(chordRoot, bassInterval);
    const dist = Math.min(semitoneDiff(prevBassNote, bass), semitoneDiff(bass, prevBassNote));
    if (dist < bestDistance) {
      bestDistance = dist;
      bestInv = inv;
    }
  }

  return bestInv;
}

// ── Secondary dominants ──────────────────────────────────────────────

function getSecondaryDominant(
  key: NoteName,
  mode: ModeName,
  targetDegree: number,
): { rootSemitones: number; quality: ChordQuality; roman: string } | null {
  // Only tonicize standard targets: ii, IV, V, vi
  if (!VALID_SEC_DOM_TARGETS.has(targetDegree)) return null;

  const degrees = MODE_DEGREES[mode];
  // Don't tonicize diminished chords
  if (degrees[targetDegree].quality === "dim") return null;

  const scaleIntervals = SCALE_INTERVALS[mode];
  const targetSemitones = scaleIntervals[targetDegree];
  const rootSemitones = (targetSemitones + 7) % 12;
  const targetRoman = degrees[targetDegree].roman;

  return { rootSemitones, quality: "dom7", roman: `V7/${targetRoman}` };
}

// ── Tritone substitution ─────────────────────────────────────────────

function tritoneSub(chordRoot: NoteName): { root: NoteName; roman: string } {
  return { root: transposeNote(chordRoot, 6), roman: "♭II7" };
}

// ── Pedal bass ───────────────────────────────────────────────────────

function getPedalBass(key: NoteName, mode: ModeName): NoteName {
  return transposeNote(key, SCALE_INTERVALS[mode][0]);
}

// ── Rhythm generation (with chord count caps) ────────────────────────
// 4 bars: 4-6 chords max.  8 bars: 4-8 chords max.

function generateRhythm(
  totalBeats: number,
  style: "even" | "varied" | "halves",
): number[] {
  const maxChords = totalBeats === 16 ? 6 : 8;
  const minChords = 4;

  if (style === "even") {
    // All whole notes: 4 chords for 4 bars, 8 for 8 bars
    const count = totalBeats / 4;
    return Array(count).fill(4);
  }

  if (style === "halves") {
    // Cap at maxChords even in halves mode
    const naturalCount = totalBeats / 2;
    if (naturalCount <= maxChords) {
      return Array(naturalCount).fill(2);
    }
    // Mix of wholes and halves to stay under cap
    return generateMixedRhythm(totalBeats, maxChords);
  }

  // "varied" — mix of whole and half notes, respecting chord count limits
  return generateMixedRhythm(totalBeats, maxChords);
}

function generateMixedRhythm(totalBeats: number, maxChords: number): number[] {
  // Generate bar by bar: each bar is either 1 whole (4 beats) or 2 halves (4 beats)
  const bars = totalBeats / 4;
  const durations: number[] = [];

  // Decide how many bars get split into halves
  // Each split bar adds 1 extra chord. Start with `bars` chords (all whole).
  // Max splits = maxChords - bars
  const maxSplits = Math.max(0, maxChords - bars);
  let splits = 0;

  for (let bar = 0; bar < bars; bar++) {
    if (splits < maxSplits && Math.random() < 0.4) {
      durations.push(2, 2);
      splits++;
    } else {
      durations.push(4);
    }
  }

  return durations;
}

// ── Cadence generation ───────────────────────────────────────────────

interface CadenceChord {
  degree: number;
  forceQuality?: ChordQuality;
  forcedRoman?: string;
}

function getCadence(
  mode: ModeName,
  type: "authentic" | "plagal" | "deceptive" | "half" | "mixed",
): CadenceChord[] {
  const actualType = type === "mixed"
    ? pickRandom(["authentic", "plagal", "deceptive", "half"] as const)
    : type;

  const isMinorLike = mode === "minor" || mode === "dorian" || mode === "phrygian";

  switch (actualType) {
    case "authentic":
      return isMinorLike
        ? [{ degree: 4, forceQuality: "maj", forcedRoman: "V" }, { degree: 0 }]
        : [{ degree: 4 }, { degree: 0 }];
    case "plagal":
      return [{ degree: 3 }, { degree: 0 }];
    case "deceptive":
      return isMinorLike
        ? [{ degree: 4, forceQuality: "maj", forcedRoman: "V" }, { degree: 5 }]
        : [{ degree: 4 }, { degree: 5 }];
    case "half":
      return [
        { degree: isMinorLike ? 3 : 1 },
        { degree: 4, forceQuality: isMinorLike ? "maj" : undefined, forcedRoman: isMinorLike ? "V" : undefined },
      ];
    default:
      return [{ degree: 4 }, { degree: 0 }];
  }
}

// ── Core transition logic ────────────────────────────────────────────

function getNextDegree(
  currentDegree: number,
  currentFunction: HarmonicFunction,
  degrees: ScaleDegreeInfo[],
): number {
  const allowedFunctions = STANDARD_TRANSITIONS[currentFunction];

  const candidates: { degree: number; weight: number }[] = [];

  for (let d = 0; d < 7; d++) {
    if (d === currentDegree) continue; // never repeat the same degree
    const info = degrees[d];
    if (!allowedFunctions.includes(info.function)) continue;

    const distance = Math.min(Math.abs(d - currentDegree), 7 - Math.abs(d - currentDegree));
    let weight = distance === 1 ? 4 : distance === 3 ? 3 : distance === 4 ? 3 : distance === 2 ? 2 : 1;
    if (d === 0) weight += 1; // slight home bias
    candidates.push({ degree: d, weight });
  }

  if (candidates.length === 0) return 0;

  return weightedRandom(
    candidates.map((c) => c.degree),
    candidates.map((c) => c.weight),
  );
}

// ── Modal interchange ────────────────────────────────────────────────

function maybeBorrowChord(
  mode: ModeName,
  degree: number,
  chromaticChance: number,
): { borrowedMode: ModeName } | null {
  if (Math.random() > chromaticChance) return null;

  const borrowModes: ModeName[] = mode === "major"
    ? ["minor", "dorian", "mixolydian"]
    : ["major", "dorian", "lydian"];

  return { borrowedMode: pickRandom(borrowModes) };
}

// ── Progression scoring / validation ─────────────────────────────────
// Scores a candidate progression. Returns a number 0-100.
// Progressions scoring below the threshold get re-rolled.

interface ChordSpec {
  degree: number;
  quality: ChordQuality;
  roman: string;
  fn: HarmonicFunction;
  duration: number;
  isDiatonic: boolean;
  isSecondaryDom: boolean;
  rootOverride?: NoteName;
}

function scoreProgression(specs: ChordSpec[]): number {
  let score = 100;

  // 1. Penalize back-to-back same degree (unless tonic)
  for (let i = 1; i < specs.length; i++) {
    if (specs[i].degree === specs[i - 1].degree && !specs[i].isSecondaryDom && !specs[i - 1].isSecondaryDom) {
      if (specs[i].degree !== 0) {
        score -= 20; // same non-tonic chord repeated = bad
      }
    }
  }

  // 2. Penalize 3+ consecutive non-diatonic chords
  let nonDiatonicRun = 0;
  for (const spec of specs) {
    if (!spec.isDiatonic) {
      nonDiatonicRun++;
      if (nonDiatonicRun >= 3) score -= 25;
    } else {
      nonDiatonicRun = 0;
    }
  }

  // 3. Penalize if tonic (degree 0) never appears
  const hasTonic = specs.some((s) => s.degree === 0 && !s.isSecondaryDom);
  if (!hasTonic) score -= 15;

  // 4. Penalize if too many secondary dominants (> 2 in the progression)
  const secDomCount = specs.filter((s) => s.isSecondaryDom).length;
  if (secDomCount > 2) score -= 15 * (secDomCount - 2);

  // 5. Penalize progressions that stay on one function too long (3+ same fn)
  for (let i = 2; i < specs.length; i++) {
    if (specs[i].fn === specs[i - 1].fn && specs[i].fn === specs[i - 2].fn) {
      score -= 10;
    }
  }

  // 6. Reward variety of degrees used
  const uniqueDegrees = new Set(specs.filter((s) => !s.isSecondaryDom).map((s) => s.degree));
  if (uniqueDegrees.size >= 4) score += 5;
  if (uniqueDegrees.size <= 2) score -= 15;

  return Math.max(0, Math.min(100, score));
}

// ── Main generation function ─────────────────────────────────────────

const MIN_SCORE = 60;
const MAX_ATTEMPTS = 20;

export function generateProgression(
  moodId: string,
  key: NoteName,
): ChordProgression {
  const profile = MOOD_PROFILES[moodId];
  if (!profile) throw new Error(`Unknown mood: ${moodId}`);

  const mood = MOODS.find((m) => m.id === moodId);

  // Try up to MAX_ATTEMPTS times, keep the best
  let bestResult: ChordProgression | null = null;
  let bestScore = -1;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const result = generateCandidate(key, profile, mood?.name ?? moodId);
    const score = scoreProgression(result.specs);

    if (score > bestScore) {
      bestScore = score;
      bestResult = result.progression;
    }

    if (score >= MIN_SCORE) break; // good enough
  }

  return bestResult!;
}

function generateCandidate(
  key: NoteName,
  profile: MoodProfile,
  moodName: string,
): { progression: ChordProgression; specs: ChordSpec[] } {
  // 1. Pick mode
  const mode = weightedRandom(profile.modes, profile.modeWeights);
  const degrees = MODE_DEGREES[mode];

  // 2. Phrase length
  const totalBeats = weightedRandom(profile.phraseLengths, profile.phraseWeights);

  // 3. Rhythm (with chord count caps)
  const durations = generateRhythm(totalBeats, profile.rhythmStyle);
  const chordCount = durations.length;

  // 4. Cadence
  const cadence = getCadence(mode, profile.preferredCadence);

  // 5. Pedal bass
  const usePedalBass = Math.random() < profile.pedalBassChance;
  const pedalNote = usePedalBass ? getPedalBass(key, mode) : undefined;
  const pedalEndIndex = usePedalBass ? Math.ceil(chordCount / 2) : 0;

  // 6. Starting degree
  const startDegree = weightedRandom(profile.startDegrees, profile.startWeights);

  // 7. Build chord specs
  const specs: ChordSpec[] = [];
  let currentDegree = startDegree;

  for (let i = 0; i < chordCount; i++) {
    const isCadenceStart = i === chordCount - 2;
    const isCadenceEnd = i === chordCount - 1;

    let degree = 0;
    let degreeInfo: ScaleDegreeInfo = degrees[0];
    let isSecondaryDom = false;
    let rootOverride: NoteName | undefined;
    let isDiatonic = true;

    if (isCadenceEnd && cadence.length >= 2) {
      degree = cadence[1].degree;
      degreeInfo = { ...degrees[degree] };
      if (cadence[1].forceQuality) degreeInfo.quality = cadence[1].forceQuality;
      if (cadence[1].forcedRoman) degreeInfo.roman = cadence[1].forcedRoman;
    } else if (isCadenceStart && cadence.length >= 2) {
      degree = cadence[0].degree;
      degreeInfo = { ...degrees[degree] };
      if (cadence[0].forceQuality) degreeInfo.quality = cadence[0].forceQuality;
      if (cadence[0].forcedRoman) degreeInfo.roman = cadence[0].forcedRoman;
    } else if (i === 0) {
      degree = startDegree;
      degreeInfo = degrees[degree];
    } else {
      degree = getNextDegree(currentDegree, degrees[currentDegree].function, degrees);

      // Secondary dominant (only on valid targets, max 1 per progression attempt here)
      const existingSecDoms = specs.filter((s) => s.isSecondaryDom).length;
      if (existingSecDoms < 2 && Math.random() < profile.secondaryDominantChance) {
        const secDom = getSecondaryDominant(key, mode, degree);
        if (secDom) {
          isSecondaryDom = true;
          isDiatonic = false;
          rootOverride = transposeNote(key, secDom.rootSemitones);
          degreeInfo = { quality: secDom.quality, roman: secDom.roman, function: "dominant" };
        }
      }

      if (!isSecondaryDom) {
        // Modal interchange
        const borrowed = maybeBorrowChord(mode, degree, profile.chromaticChance);
        if (borrowed) {
          degreeInfo = MODE_DEGREES[borrowed.borrowedMode][degree];
          isDiatonic = false;
        } else {
          degreeInfo = degrees[degree];
        }
      }
    }

    // Tritone substitution (only on diatonic dom7 chords)
    if (
      !isSecondaryDom &&
      degreeInfo.quality === "dom7" &&
      degreeInfo.function === "dominant" &&
      Math.random() < profile.tritoneSubChance
    ) {
      const chordRoot = transposeNote(key, SCALE_INTERVALS[mode][degree]);
      const sub = tritoneSub(chordRoot);
      rootOverride = sub.root;
      degreeInfo = { ...degreeInfo, roman: sub.roman };
      isDiatonic = false;
    }

    // Quality extension (sus gated by degree)
    let finalQuality = degreeInfo.quality;
    let roman = degreeInfo.roman;

    if (!isSecondaryDom) {
      const { quality: extQ, romanSuffix } = maybeExtend(
        degreeInfo.quality,
        profile.extensionChance,
        profile.susChance,
        degreeInfo.function,
        degree,
      );
      finalQuality = extQ;
      if (romanSuffix) {
        roman = degreeInfo.roman.replace(/[°+]$/, "") + romanSuffix;
      }
    }

    specs.push({
      degree, quality: finalQuality, roman,
      fn: degreeInfo.function,
      duration: durations[i],
      isDiatonic,
      isSecondaryDom,
      rootOverride,
    });

    if (!isSecondaryDom) {
      currentDegree = degree;
    }
  }

  // 8. Build Chord objects with inversions
  let prevBassNote: NoteName | undefined;

  const chords = specs.map((spec, i) => {
    const chordRoot = spec.rootOverride ?? transposeNote(key, SCALE_INTERVALS[mode][spec.degree]);
    const inversion = chooseInversion(spec.quality, profile.inversionChance, prevBassNote, chordRoot);

    let bassNote: NoteName | undefined;
    if (usePedalBass && i < pedalEndIndex && pedalNote) {
      bassNote = pedalNote;
    }

    const chord = spec.rootOverride
      ? buildChord(spec.rootOverride, spec.quality, spec.roman, spec.fn, spec.duration, inversion, bassNote)
      : buildChordFromDegree(key, mode, spec.degree, spec.quality, spec.roman, spec.fn, spec.duration, inversion, bassNote);

    // Track bass for next chord's voice leading
    const intervals = CHORD_INTERVALS[spec.quality];
    const invBassInterval = intervals[Math.min(inversion, intervals.length - 1)] ?? 0;
    prevBassNote = bassNote ?? transposeNote(chordRoot, invBassInterval);

    return chord;
  });

  // Voice leading range check: ensure no chord spans > 24 semitones (2 octaves)
  for (const chord of chords) {
    const range = chord.midiNotes[chord.midiNotes.length - 1] - chord.midiNotes[0];
    if (range > 24) {
      // Compact: move lowest note up or highest note down
      while (chord.midiNotes[chord.midiNotes.length - 1] - chord.midiNotes[0] > 24) {
        chord.midiNotes[chord.midiNotes.length - 1] -= 12;
      }
      chord.midiNotes.sort((a, b) => a - b);
    }
  }

  return {
    progression: { chords, key, mode, mood: moodName, totalBeats },
    specs,
  };
}

// ── MIDI helpers ─────────────────────────────────────────────────────

export function midiToNoteName(midi: number): string {
  const note = ALL_NOTES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

// ── Transposition ────────────────────────────────────────────────────

export function transposeProgression(
  progression: ChordProgression,
  newKey: NoteName,
): ChordProgression {
  const oldKeyIndex = ALL_NOTES.indexOf(progression.key);
  const newKeyIndex = ALL_NOTES.indexOf(newKey);
  const semitoneShift = ((newKeyIndex - oldKeyIndex) + 12) % 12;

  if (semitoneShift === 0) return progression;

  const transposedChords = progression.chords.map((chord) => {
    const newRoot = transposeNote(chord.root, semitoneShift);
    const newMidiNotes = chord.midiNotes.map((n) => n + semitoneShift);
    const newBassNote = chord.bassNote ? transposeNote(chord.bassNote, semitoneShift) : undefined;

    let newLabel = `${newRoot}${QUALITY_LABELS[chord.quality]}`;
    if (newBassNote && newBassNote !== newRoot) {
      newLabel += `/${newBassNote}`;
    } else if (chord.inversion > 0) {
      const intervals = CHORD_INTERVALS[chord.quality];
      const invBassInterval = intervals[chord.inversion] ?? 0;
      const invBass = transposeNote(newRoot, invBassInterval);
      if (invBass !== newRoot) newLabel += `/${invBass}`;
    }
    if (chord.durationBeats === 2) newLabel += " (½)";

    return { ...chord, root: newRoot, midiNotes: newMidiNotes, label: newLabel, bassNote: newBassNote };
  });

  return { ...progression, key: newKey, chords: transposedChords };
}

export const KEY_OPTIONS: NoteName[] = ALL_NOTES;
