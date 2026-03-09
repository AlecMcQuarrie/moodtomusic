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

// ── Scale degree definitions per mode ────────────────────────────────
// Each degree has: its natural diatonic quality, roman numeral, and
// harmonic function. This is the foundation of the generative system.

interface ScaleDegreeInfo {
  quality: ChordQuality;
  roman: string;
  function: HarmonicFunction;
}

const MAJOR_DEGREES: ScaleDegreeInfo[] = [
  { quality: "maj",    roman: "I",    function: "tonic" },
  { quality: "min",    roman: "ii",   function: "predominant" },
  { quality: "min",    roman: "iii",  function: "tonic" },
  { quality: "maj",    roman: "IV",   function: "subdominant" },
  { quality: "maj",    roman: "V",    function: "dominant" },
  { quality: "min",    roman: "vi",   function: "tonic" },
  { quality: "dim",    roman: "vii°", function: "dominant" },
];

const MINOR_DEGREES: ScaleDegreeInfo[] = [
  { quality: "min",    roman: "i",    function: "tonic" },
  { quality: "dim",    roman: "ii°",  function: "predominant" },
  { quality: "maj",    roman: "III",  function: "tonic" },
  { quality: "min",    roman: "iv",   function: "subdominant" },
  { quality: "min",    roman: "v",    function: "dominant" },
  { quality: "maj",    roman: "VI",   function: "subdominant" },
  { quality: "maj",    roman: "VII",  function: "dominant" },
];

const DORIAN_DEGREES: ScaleDegreeInfo[] = [
  { quality: "min",    roman: "i",    function: "tonic" },
  { quality: "min",    roman: "ii",   function: "predominant" },
  { quality: "maj",    roman: "III",  function: "tonic" },
  { quality: "maj",    roman: "IV",   function: "subdominant" },
  { quality: "min",    roman: "v",    function: "dominant" },
  { quality: "dim",    roman: "vi°",  function: "subdominant" },
  { quality: "maj",    roman: "VII",  function: "dominant" },
];

const MIXOLYDIAN_DEGREES: ScaleDegreeInfo[] = [
  { quality: "maj",    roman: "I",    function: "tonic" },
  { quality: "min",    roman: "ii",   function: "predominant" },
  { quality: "dim",    roman: "iii°", function: "dominant" },
  { quality: "maj",    roman: "IV",   function: "subdominant" },
  { quality: "min",    roman: "v",    function: "dominant" },
  { quality: "min",    roman: "vi",   function: "tonic" },
  { quality: "maj",    roman: "♭VII", function: "subdominant" },
];

const PHRYGIAN_DEGREES: ScaleDegreeInfo[] = [
  { quality: "min",    roman: "i",    function: "tonic" },
  { quality: "maj",    roman: "♭II",  function: "subdominant" },
  { quality: "maj",    roman: "III",  function: "tonic" },
  { quality: "min",    roman: "iv",   function: "subdominant" },
  { quality: "dim",    roman: "v°",   function: "dominant" },
  { quality: "maj",    roman: "♭VI",  function: "subdominant" },
  { quality: "min",    roman: "♭vii", function: "dominant" },
];

const LYDIAN_DEGREES: ScaleDegreeInfo[] = [
  { quality: "maj",    roman: "I",    function: "tonic" },
  { quality: "maj",    roman: "II",   function: "subdominant" },
  { quality: "min",    roman: "iii",  function: "tonic" },
  { quality: "aug",    roman: "IV+",  function: "subdominant" },
  { quality: "maj",    roman: "V",    function: "dominant" },
  { quality: "min",    roman: "vi",   function: "tonic" },
  { quality: "dim",    roman: "vii°", function: "dominant" },
];

const MODE_DEGREES: Record<ModeName, ScaleDegreeInfo[]> = {
  major: MAJOR_DEGREES,
  minor: MINOR_DEGREES,
  dorian: DORIAN_DEGREES,
  mixolydian: MIXOLYDIAN_DEGREES,
  phrygian: PHRYGIAN_DEGREES,
  lydian: LYDIAN_DEGREES,
};

// ── Harmonic function transition rules ───────────────────────────────
// These encode the fundamental voice-leading tendencies of tonal music.
// T = tonic, S = subdominant, P = predominant, D = dominant
//
// Standard: T → (any)     S → D or T     P → D     D → T
// With flexibility for color and variety.

type TransitionMap = Record<HarmonicFunction, HarmonicFunction[]>;

const STANDARD_TRANSITIONS: TransitionMap = {
  tonic:        ["subdominant", "predominant", "dominant", "tonic"],
  subdominant:  ["dominant", "tonic", "predominant"],
  predominant:  ["dominant", "subdominant"],
  dominant:     ["tonic", "subdominant"],  // deceptive resolution possible
};

// ── Mood profiles ────────────────────────────────────────────────────
// Each mood defines: which modes to pick from, how likely to use
// extensions (7ths/9ths), how likely to use sus chords, how much
// chromaticism, preferred phrase lengths, and transition looseness.

interface MoodProfile {
  modes: ModeName[];
  modeWeights: number[];
  extensionChance: number;     // 0-1, chance to upgrade triad → 7th/9th
  susChance: number;           // 0-1, chance to use sus2/sus4 on tonic
  chromaticChance: number;     // 0-1, chance of modal interchange / borrowed chord
  phraseLengths: number[];     // 16 = 4 bars, 32 = 8 bars (in beats)
  phraseWeights: number[];
  looseTransitions: boolean;   // allow non-standard function movement
  preferredCadence: "authentic" | "plagal" | "deceptive" | "half" | "mixed";
  rhythmStyle: "even" | "varied" | "halves";
}

const MOOD_PROFILES: Record<string, MoodProfile> = {
  joyful: {
    modes: ["major", "lydian", "mixolydian"],
    modeWeights: [5, 2, 2],
    extensionChance: 0.25,
    susChance: 0.05,
    chromaticChance: 0.1,
    phraseLengths: [16, 32],
    phraseWeights: [3, 1],
    looseTransitions: false,
    preferredCadence: "authentic",
    rhythmStyle: "even",
  },
  peaceful: {
    modes: ["major", "lydian"],
    modeWeights: [3, 2],
    extensionChance: 0.6,
    susChance: 0.3,
    chromaticChance: 0.05,
    phraseLengths: [16, 32],
    phraseWeights: [2, 3],
    looseTransitions: false,
    preferredCadence: "plagal",
    rhythmStyle: "varied",
  },
  romantic: {
    modes: ["major", "dorian", "mixolydian"],
    modeWeights: [5, 2, 1],
    extensionChance: 0.55,
    susChance: 0.1,
    chromaticChance: 0.15,
    phraseLengths: [16, 32],
    phraseWeights: [2, 3],
    looseTransitions: false,
    preferredCadence: "mixed",
    rhythmStyle: "varied",
  },
  triumphant: {
    modes: ["major", "mixolydian"],
    modeWeights: [4, 2],
    extensionChance: 0.1,
    susChance: 0.05,
    chromaticChance: 0.1,
    phraseLengths: [16, 32],
    phraseWeights: [2, 3],
    looseTransitions: false,
    preferredCadence: "authentic",
    rhythmStyle: "even",
  },
  nostalgic: {
    modes: ["major", "minor", "dorian"],
    modeWeights: [3, 3, 2],
    extensionChance: 0.45,
    susChance: 0.1,
    chromaticChance: 0.2,
    phraseLengths: [16, 32],
    phraseWeights: [2, 2],
    looseTransitions: true,
    preferredCadence: "deceptive",
    rhythmStyle: "varied",
  },
  dreamy: {
    modes: ["lydian", "major"],
    modeWeights: [3, 2],
    extensionChance: 0.7,
    susChance: 0.35,
    chromaticChance: 0.1,
    phraseLengths: [16, 32],
    phraseWeights: [1, 3],
    looseTransitions: true,
    preferredCadence: "plagal",
    rhythmStyle: "varied",
  },
  mysterious: {
    modes: ["phrygian", "minor"],
    modeWeights: [3, 2],
    extensionChance: 0.4,
    susChance: 0.1,
    chromaticChance: 0.3,
    phraseLengths: [16, 32],
    phraseWeights: [3, 2],
    looseTransitions: true,
    preferredCadence: "half",
    rhythmStyle: "varied",
  },
  melancholic: {
    modes: ["minor", "dorian", "major"],
    modeWeights: [4, 2, 1],
    extensionChance: 0.5,
    susChance: 0.15,
    chromaticChance: 0.15,
    phraseLengths: [16, 32],
    phraseWeights: [2, 3],
    looseTransitions: false,
    preferredCadence: "plagal",
    rhythmStyle: "varied",
  },
  anxious: {
    modes: ["minor", "phrygian"],
    modeWeights: [3, 2],
    extensionChance: 0.35,
    susChance: 0.05,
    chromaticChance: 0.35,
    phraseLengths: [16],
    phraseWeights: [1],
    looseTransitions: true,
    preferredCadence: "half",
    rhythmStyle: "halves",
  },
  angry: {
    modes: ["minor", "phrygian"],
    modeWeights: [3, 3],
    extensionChance: 0.15,
    susChance: 0.0,
    chromaticChance: 0.25,
    phraseLengths: [16],
    phraseWeights: [1],
    looseTransitions: true,
    preferredCadence: "half",
    rhythmStyle: "even",
  },
  hopeful: {
    modes: ["major", "mixolydian", "lydian"],
    modeWeights: [4, 2, 1],
    extensionChance: 0.35,
    susChance: 0.15,
    chromaticChance: 0.1,
    phraseLengths: [16, 32],
    phraseWeights: [3, 2],
    looseTransitions: false,
    preferredCadence: "authentic",
    rhythmStyle: "varied",
  },
  contemplative: {
    modes: ["dorian", "major", "minor"],
    modeWeights: [3, 2, 2],
    extensionChance: 0.6,
    susChance: 0.2,
    chromaticChance: 0.1,
    phraseLengths: [16, 32],
    phraseWeights: [1, 3],
    looseTransitions: true,
    preferredCadence: "plagal",
    rhythmStyle: "varied",
  },
};

// ── Moods (unchanged) ────────────────────────────────────────────────

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

// ── Chord building ───────────────────────────────────────────────────

function buildChordFromDegree(
  key: NoteName,
  mode: ModeName,
  degree: number,
  quality: ChordQuality,
  roman: string,
  harmonicFn: HarmonicFunction,
  durationBeats: number,
  octave: number = 4
): Chord {
  const scaleIntervals = SCALE_INTERVALS[mode];
  const root = transposeNote(key, scaleIntervals[degree]);
  const intervals = CHORD_INTERVALS[quality];
  const rootMidi = noteToMidi(root, octave);
  const midiNotes = intervals.map((i) => rootMidi + i);

  let label = `${root}${QUALITY_LABELS[quality]}`;
  // Append duration hint for display if not a whole note
  const durationLabel =
    durationBeats === 4 ? "" :
    durationBeats === 2 ? " (½)" :
    durationBeats === 8 ? " (𝅝𝅝)" : "";

  return {
    root,
    quality,
    midiNotes,
    label: label + durationLabel,
    romanNumeral: roman + (QUALITY_LABELS[quality] && !roman.includes("7") && !roman.includes("°") && !roman.includes("ø") && !roman.includes("+") && !roman.includes("sus") ? "" : ""),
    durationBeats,
    function: harmonicFn,
  };
}

// ── Extension / quality upgrading ────────────────────────────────────
// Upgrades a plain triad to a 7th or 9th based on mood profile chance.

function maybeExtend(
  baseQuality: ChordQuality,
  extensionChance: number,
  susChance: number,
  harmonicFn: HarmonicFunction,
): { quality: ChordQuality; romanSuffix: string } {
  // Sus chords only on tonic function
  if (harmonicFn === "tonic" && Math.random() < susChance) {
    const sus = Math.random() < 0.5 ? "sus2" : "sus4";
    return { quality: sus, romanSuffix: sus };
  }

  if (Math.random() > extensionChance) {
    return { quality: baseQuality, romanSuffix: "" };
  }

  // Upgrade based on base quality
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

// ── Rhythm generation ────────────────────────────────────────────────
// Generates a sequence of durations (in beats) that sums to exactly
// totalBeats. Only uses musically sensible note values: 2 or 4 beats
// (half notes and whole notes).

function generateRhythm(
  totalBeats: number,
  style: "even" | "varied" | "halves"
): number[] {
  if (style === "even") {
    // All whole notes
    const count = totalBeats / 4;
    return Array(count).fill(4);
  }

  if (style === "halves") {
    // All half notes
    const count = totalBeats / 2;
    return Array(count).fill(2);
  }

  // "varied" — mix of whole and half notes
  // Fill totalBeats with a random mixture, bar by bar
  const durations: number[] = [];
  let remaining = totalBeats;

  while (remaining > 0) {
    if (remaining === 2) {
      durations.push(2);
      remaining -= 2;
    } else if (remaining === 4) {
      // Last bar: whole note or two halves
      if (Math.random() < 0.6) {
        durations.push(4);
      } else {
        durations.push(2, 2);
      }
      remaining = 0;
    } else {
      // More than one bar left — decide this bar
      const r = Math.random();
      if (r < 0.5) {
        // Whole note for this bar
        durations.push(4);
        remaining -= 4;
      } else {
        // Two half notes for this bar
        durations.push(2, 2);
        remaining -= 4;
      }
    }
  }

  return durations;
}

// ── Cadence generation ───────────────────────────────────────────────
// Returns the last 2 degrees for a cadence pattern.

interface CadenceChord {
  degree: number;
  forceQuality?: ChordQuality;
  forcedRoman?: string;
}

function getCadence(
  mode: ModeName,
  type: "authentic" | "plagal" | "deceptive" | "half" | "mixed"
): CadenceChord[] {
  const actualType = type === "mixed"
    ? pickRandom(["authentic", "plagal", "deceptive", "half"] as const)
    : type;

  const isMinorLike = mode === "minor" || mode === "dorian" || mode === "phrygian";

  switch (actualType) {
    case "authentic":
      // V → I (with major V in minor = harmonic minor)
      if (isMinorLike) {
        return [
          { degree: 4, forceQuality: "maj", forcedRoman: "V" },
          { degree: 0 },
        ];
      }
      return [{ degree: 4 }, { degree: 0 }];

    case "plagal":
      // IV → I
      return [
        { degree: isMinorLike ? 3 : 3 },
        { degree: 0 },
      ];

    case "deceptive":
      // V → vi (or V → VI in minor)
      if (isMinorLike) {
        return [
          { degree: 4, forceQuality: "maj", forcedRoman: "V" },
          { degree: 5 },
        ];
      }
      return [{ degree: 4 }, { degree: 5 }];

    case "half":
      // ends on V
      return [
        { degree: isMinorLike ? 3 : 1 },
        { degree: 4, forceQuality: isMinorLike ? "maj" : undefined, forcedRoman: isMinorLike ? "V" : undefined },
      ];

    default:
      return [{ degree: 4 }, { degree: 0 }];
  }
}

// ── Core generation algorithm ────────────────────────────────────────

function getNextDegree(
  currentDegree: number,
  currentFunction: HarmonicFunction,
  degrees: ScaleDegreeInfo[],
  profile: MoodProfile,
): number {
  // Get allowed next functions
  let allowedFunctions = STANDARD_TRANSITIONS[currentFunction];

  // Loose transitions allow any function
  if (profile.looseTransitions && Math.random() < 0.3) {
    allowedFunctions = ["tonic", "subdominant", "predominant", "dominant"];
  }

  // Find all degrees matching allowed functions (excluding current degree
  // unless we're on tonic — pedal tones on I are fine)
  const candidates: { degree: number; weight: number }[] = [];

  for (let d = 0; d < 7; d++) {
    if (d === currentDegree && currentFunction !== "tonic") continue;
    const info = degrees[d];
    if (allowedFunctions.includes(info.function)) {
      // Weight by stepwise motion preference (closer = more likely)
      const distance = Math.min(
        Math.abs(d - currentDegree),
        7 - Math.abs(d - currentDegree)
      );
      // Strong preferences: step of 1 or 4th/5th motion
      let weight = distance === 1 ? 4 :
                   distance === 3 ? 3 :
                   distance === 4 ? 3 :
                   distance === 2 ? 2 : 1;

      // Boost root (degree 0) slightly — we want to visit home
      if (d === 0) weight += 1;

      candidates.push({ degree: d, weight });
    }
  }

  if (candidates.length === 0) {
    // Fallback: go to tonic
    return 0;
  }

  return weightedRandom(
    candidates.map((c) => c.degree),
    candidates.map((c) => c.weight)
  );
}

// ── Borrowed / chromatic chord ───────────────────────────────────────
// Applies modal interchange: borrows a chord from a parallel mode.

function maybeBorrowChord(
  key: NoteName,
  mode: ModeName,
  degree: number,
  profile: MoodProfile,
): { borrowedMode: ModeName; degree: number } | null {
  if (Math.random() > profile.chromaticChance) return null;

  // Pick a parallel mode to borrow from
  const borrowModes: ModeName[] = mode === "major"
    ? ["minor", "dorian", "mixolydian"]
    : ["major", "dorian", "lydian"];

  const borrowMode = pickRandom(borrowModes);
  // Use the same degree from the borrowed mode
  return { borrowedMode: borrowMode, degree };
}

// ── Main public function ─────────────────────────────────────────────

export function generateProgression(
  moodId: string,
  key: NoteName
): ChordProgression {
  const profile = MOOD_PROFILES[moodId];
  if (!profile) throw new Error(`Unknown mood: ${moodId}`);

  const mood = MOODS.find((m) => m.id === moodId);

  // 1. Pick mode
  const mode = weightedRandom(profile.modes, profile.modeWeights);
  const degrees = MODE_DEGREES[mode];

  // 2. Pick phrase length
  const totalBeats = weightedRandom(profile.phraseLengths, profile.phraseWeights);

  // 3. Generate rhythm
  const durations = generateRhythm(totalBeats, profile.rhythmStyle);
  const chordCount = durations.length;

  // 4. Generate cadence (last 2 chords)
  const cadence = getCadence(mode, profile.preferredCadence);

  // 5. Generate chords using harmonic function transitions
  const chordSpecs: Array<{
    degree: number;
    quality: ChordQuality;
    roman: string;
    fn: HarmonicFunction;
    duration: number;
  }> = [];

  // Start on tonic (degree 0)
  let currentDegree = 0;

  for (let i = 0; i < chordCount; i++) {
    const isCadenceStart = i === chordCount - 2;
    const isCadenceEnd = i === chordCount - 1;

    let degree: number;
    let useMode = mode;
    let degreeInfo: ScaleDegreeInfo;

    if (isCadenceEnd && cadence.length >= 2) {
      // Final chord of cadence
      degree = cadence[1].degree;
      degreeInfo = { ...degrees[degree] };
      if (cadence[1].forceQuality) degreeInfo.quality = cadence[1].forceQuality;
      if (cadence[1].forcedRoman) degreeInfo.roman = cadence[1].forcedRoman;
    } else if (isCadenceStart && cadence.length >= 2) {
      // Penultimate chord of cadence
      degree = cadence[0].degree;
      degreeInfo = { ...degrees[degree] };
      if (cadence[0].forceQuality) degreeInfo.quality = cadence[0].forceQuality;
      if (cadence[0].forcedRoman) degreeInfo.roman = cadence[0].forcedRoman;
    } else if (i === 0) {
      // Start on tonic
      degree = 0;
      degreeInfo = degrees[0];
    } else {
      // Normal transition
      degree = getNextDegree(currentDegree, degrees[currentDegree].function, degrees, profile);

      // Maybe borrow from parallel mode
      const borrowed = maybeBorrowChord(key, mode, degree, profile);
      if (borrowed) {
        useMode = borrowed.borrowedMode;
        degreeInfo = MODE_DEGREES[useMode][borrowed.degree];
      } else {
        degreeInfo = degrees[degree];
      }
    }

    // Maybe extend the chord quality
    const { quality, romanSuffix } = maybeExtend(
      degreeInfo.quality,
      profile.extensionChance,
      profile.susChance,
      degreeInfo.function,
    );

    const roman = romanSuffix
      ? degreeInfo.roman.replace(/[°+]$/, "") + romanSuffix
      : degreeInfo.roman;

    chordSpecs.push({
      degree,
      quality,
      roman,
      fn: degreeInfo.function,
      duration: durations[i],
    });

    currentDegree = degree;
  }

  // 6. Build actual Chord objects
  const chords = chordSpecs.map((spec) =>
    buildChordFromDegree(
      key,
      mode,
      spec.degree,
      spec.quality,
      spec.roman,
      spec.fn,
      spec.duration
    )
  );

  return {
    chords,
    key,
    mode,
    mood: mood?.name ?? moodId,
    totalBeats,
  };
}

// ── MIDI helpers ─────────────────────────────────────────────────────

export function midiToNoteName(midi: number): string {
  const note = ALL_NOTES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

// ── Transposition ────────────────────────────────────────────────────
// Transposes an existing progression to a new key, preserving all
// chord qualities, durations, roman numerals, and structure.

export function transposeProgression(
  progression: ChordProgression,
  newKey: NoteName
): ChordProgression {
  const oldKeyIndex = ALL_NOTES.indexOf(progression.key);
  const newKeyIndex = ALL_NOTES.indexOf(newKey);
  const semitoneShift = ((newKeyIndex - oldKeyIndex) + 12) % 12;

  if (semitoneShift === 0) return progression;

  const transposedChords = progression.chords.map((chord) => {
    const newRoot = transposeNote(chord.root, semitoneShift);
    const newMidiNotes = chord.midiNotes.map((n) => n + semitoneShift);
    const newLabel = chord.label.replace(chord.root, newRoot);

    return {
      ...chord,
      root: newRoot,
      midiNotes: newMidiNotes,
      label: newLabel,
    };
  });

  return {
    ...progression,
    key: newKey,
    chords: transposedChords,
  };
}

export const KEY_OPTIONS: NoteName[] = ALL_NOTES;
