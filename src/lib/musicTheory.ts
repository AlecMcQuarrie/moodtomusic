// ── Core music theory types ──────────────────────────────────────────

export type NoteName =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

export type ChordQuality =
  | "maj"
  | "min"
  | "dim"
  | "aug"
  | "maj7"
  | "min7"
  | "dom7"
  | "dim7"
  | "min7b5"
  | "aug7"
  | "sus2"
  | "sus4"
  | "add9"
  | "min9"
  | "maj9"
  | "dom9";

export interface Chord {
  root: NoteName;
  quality: ChordQuality;
  midiNotes: number[];
  label: string;
  romanNumeral: string;
}

export interface ChordProgression {
  chords: Chord[];
  key: NoteName;
  mode: "major" | "minor" | "dorian" | "mixolydian" | "phrygian" | "lydian";
  mood: string;
  name: string;
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
  aug7: [0, 4, 8, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  add9: [0, 4, 7, 14],
  min9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  dom9: [0, 4, 7, 10, 14],
};

const SCALE_INTERVALS: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
};

// ── Available moods ──────────────────────────────────────────────────

export const MOODS: Mood[] = [
  { id: "joyful", name: "Joyful", emoji: "☀️", description: "Bright and uplifting", color: "#F59E0B", category: "positive" },
  { id: "peaceful", name: "Peaceful", emoji: "🌿", description: "Calm and serene", color: "#10B981", category: "positive" },
  { id: "romantic", name: "Romantic", emoji: "🌹", description: "Warm and tender", color: "#EC4899", category: "positive" },
  { id: "triumphant", name: "Triumphant", emoji: "⚡", description: "Victorious and powerful", color: "#F97316", category: "positive" },
  { id: "nostalgic", name: "Nostalgic", emoji: "🌅", description: "Bittersweet memories", color: "#8B5CF6", category: "neutral" },
  { id: "dreamy", name: "Dreamy", emoji: "☁️", description: "Floating and ethereal", color: "#6366F1", category: "neutral" },
  { id: "mysterious", name: "Mysterious", emoji: "🌙", description: "Enigmatic and curious", color: "#7C3AED", category: "neutral" },
  { id: "melancholic", name: "Melancholic", emoji: "🌧️", description: "Gentle sadness", color: "#6B7280", category: "negative" },
  { id: "anxious", name: "Anxious", emoji: "💫", description: "Tense and unsettled", color: "#EF4444", category: "intense" },
  { id: "angry", name: "Angry", emoji: "🔥", description: "Fierce and aggressive", color: "#DC2626", category: "intense" },
  { id: "hopeful", name: "Hopeful", emoji: "🌱", description: "Gently optimistic", color: "#14B8A6", category: "positive" },
  { id: "contemplative", name: "Contemplative", emoji: "🔮", description: "Deep in thought", color: "#8B5CF6", category: "neutral" },
];

// ── Helpers ──────────────────────────────────────────────────────────

function noteToMidi(note: NoteName, octave: number): number {
  return ALL_NOTES.indexOf(note) + (octave + 1) * 12;
}

function transposeNote(root: NoteName, semitones: number): NoteName {
  const idx = ALL_NOTES.indexOf(root);
  return ALL_NOTES[(idx + semitones + 12) % 12];
}

function buildChord(
  root: NoteName,
  quality: ChordQuality,
  octave: number = 4,
  romanNumeral: string = ""
): Chord {
  const intervals = CHORD_INTERVALS[quality];
  const rootMidi = noteToMidi(root, octave);
  const midiNotes = intervals.map((i) => rootMidi + i);

  const qualityLabels: Record<ChordQuality, string> = {
    maj: "", min: "m", dim: "°", aug: "+",
    maj7: "maj7", min7: "m7", dom7: "7", dim7: "°7",
    min7b5: "ø7", aug7: "+7", sus2: "sus2", sus4: "sus4",
    add9: "add9", min9: "m9", maj9: "maj9", dom9: "9",
  };

  return {
    root,
    quality,
    midiNotes,
    label: `${root}${qualityLabels[quality]}`,
    romanNumeral,
  };
}

function getScaleDegreeChord(
  key: NoteName,
  mode: string,
  degree: number,
  quality: ChordQuality,
  romanNumeral: string,
  octave: number = 4
): Chord {
  const intervals = SCALE_INTERVALS[mode];
  const root = transposeNote(key, intervals[degree]);
  return buildChord(root, quality, octave, romanNumeral);
}

// ── Mood-to-progression mappings ─────────────────────────────────────
// Each mood maps to multiple possible progression templates.
// Templates use scale degrees (0-indexed) and chord qualities based on
// real music theory: common progressions, modal interchange, secondary
// dominants, borrowed chords, and chromatic mediants.

interface ProgressionTemplate {
  name: string;
  mode: "major" | "minor" | "dorian" | "mixolydian" | "phrygian" | "lydian";
  steps: Array<{ degree: number; quality: ChordQuality; roman: string }>;
}

const MOOD_PROGRESSIONS: Record<string, ProgressionTemplate[]> = {
  joyful: [
    {
      name: "Classic Pop (I–V–vi–IV)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 4, quality: "maj", roman: "V" },
        { degree: 5, quality: "min", roman: "vi" },
        { degree: 3, quality: "maj", roman: "IV" },
      ],
    },
    {
      name: "Bright Lydian Lift (Imaj7–II–vi–IV)",
      mode: "lydian",
      steps: [
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 1, quality: "maj", roman: "II" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 3, quality: "maj", roman: "IV" },
      ],
    },
    {
      name: "Upbeat Shuffle (I–IV–V–V)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 4, quality: "maj", roman: "V" },
        { degree: 4, quality: "maj", roman: "V" },
      ],
    },
    {
      name: "Gospel Joy (I–iii–IV–V)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 2, quality: "min7", roman: "iiim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 4, quality: "dom7", roman: "V7" },
      ],
    },
  ],

  peaceful: [
    {
      name: "Ambient Drift (Imaj7–IVmaj7–vim7–IVmaj7)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
      ],
    },
    {
      name: "Suspended Calm (Isus2–IV–Isus4–IV)",
      mode: "major",
      steps: [
        { degree: 0, quality: "sus2", roman: "Isus2" },
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 0, quality: "sus4", roman: "Isus4" },
        { degree: 3, quality: "maj", roman: "IV" },
      ],
    },
    {
      name: "Pastoral Major (I–iii–IV–I)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 2, quality: "min", roman: "iii" },
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 0, quality: "maj", roman: "I" },
      ],
    },
    {
      name: "Floating Ninths (Imaj9–vim7–IVmaj7–vim7)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj9", roman: "Imaj9" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 5, quality: "min7", roman: "vim7" },
      ],
    },
  ],

  romantic: [
    {
      name: "Ballad (vi–IV–I–V)",
      mode: "major",
      steps: [
        { degree: 5, quality: "min", roman: "vi" },
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 4, quality: "maj", roman: "V" },
      ],
    },
    {
      name: "Jazz Romance (IIm9–V9–Imaj7–vim7)",
      mode: "major",
      steps: [
        { degree: 1, quality: "min9", roman: "iim9" },
        { degree: 4, quality: "dom9", roman: "V9" },
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 5, quality: "min7", roman: "vim7" },
      ],
    },
    {
      name: "Chromatic Descent (I–V/vii–vi–IV)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 6, quality: "maj", roman: "♭VII" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
      ],
    },
    {
      name: "Tender Waltz (I–vi–ii7–V7)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 5, quality: "min", roman: "vi" },
        { degree: 1, quality: "min7", roman: "ii7" },
        { degree: 4, quality: "dom7", roman: "V7" },
      ],
    },
  ],

  triumphant: [
    {
      name: "Power Anthem (I–V–vi–IV)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 4, quality: "maj", roman: "V" },
        { degree: 5, quality: "min", roman: "vi" },
        { degree: 3, quality: "maj", roman: "IV" },
      ],
    },
    {
      name: "Heroic Climb (IV–V–vi–I)",
      mode: "major",
      steps: [
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 4, quality: "maj", roman: "V" },
        { degree: 5, quality: "min", roman: "vi" },
        { degree: 0, quality: "maj", roman: "I" },
      ],
    },
    {
      name: "Plagal Victory (I–IV–V–I)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 4, quality: "maj", roman: "V" },
        { degree: 0, quality: "maj", roman: "I" },
      ],
    },
  ],

  nostalgic: [
    {
      name: "Retro Pop (I–vi–IV–V)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 5, quality: "min", roman: "vi" },
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 4, quality: "maj", roman: "V" },
      ],
    },
    {
      name: "Wistful Minor (i–VI–III–VII)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 5, quality: "maj", roman: "VI" },
        { degree: 2, quality: "maj", roman: "III" },
        { degree: 6, quality: "maj", roman: "VII" },
      ],
    },
    {
      name: "Dorian Nostalgia (im7–IV–vim7b5–IV)",
      mode: "dorian",
      steps: [
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 5, quality: "min7b5", roman: "viø7" },
        { degree: 3, quality: "maj", roman: "IV" },
      ],
    },
    {
      name: "Memory Lane (IVmaj7–vim7–Imaj7–iiim7)",
      mode: "major",
      steps: [
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 2, quality: "min7", roman: "iiim7" },
      ],
    },
  ],

  dreamy: [
    {
      name: "Lydian Float (Imaj7–II–viim7–Imaj7)",
      mode: "lydian",
      steps: [
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 1, quality: "maj", roman: "II" },
        { degree: 6, quality: "min7", roman: "viim7" },
        { degree: 0, quality: "maj7", roman: "Imaj7" },
      ],
    },
    {
      name: "Ethereal Ninths (Imaj9–iiim7–vim7–IVmaj7)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj9", roman: "Imaj9" },
        { degree: 2, quality: "min7", roman: "iiim7" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
      ],
    },
    {
      name: "Suspended Dream (Isus2–IVadd9–vim7–Isus2)",
      mode: "major",
      steps: [
        { degree: 0, quality: "sus2", roman: "Isus2" },
        { degree: 3, quality: "add9", roman: "IVadd9" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 0, quality: "sus2", roman: "Isus2" },
      ],
    },
    {
      name: "Cloud Nine (IVmaj7–Imaj7–iiim7–vim9)",
      mode: "major",
      steps: [
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 2, quality: "min7", roman: "iiim7" },
        { degree: 5, quality: "min9", roman: "vim9" },
      ],
    },
  ],

  mysterious: [
    {
      name: "Phrygian Veil (i–♭II–i–♭VII)",
      mode: "phrygian",
      steps: [
        { degree: 0, quality: "min", roman: "i" },
        { degree: 1, quality: "maj", roman: "♭II" },
        { degree: 0, quality: "min", roman: "i" },
        { degree: 6, quality: "maj", roman: "♭VII" },
      ],
    },
    {
      name: "Diminished Mystery (i–°7–♭VI–♭VII)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min", roman: "i" },
        { degree: 6, quality: "dim7", roman: "vii°7" },
        { degree: 5, quality: "maj", roman: "♭VI" },
        { degree: 6, quality: "maj", roman: "♭VII" },
      ],
    },
    {
      name: "Enigma (im7–♭IImaj7–iv7–♭VImaj7)",
      mode: "phrygian",
      steps: [
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 1, quality: "maj7", roman: "♭IImaj7" },
        { degree: 3, quality: "min7", roman: "iv7" },
        { degree: 5, quality: "maj7", roman: "♭VImaj7" },
      ],
    },
    {
      name: "Chromatic Shadow (im7–♭II–V7–im7)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 1, quality: "maj", roman: "♭II" },
        { degree: 4, quality: "dom7", roman: "V7" },
        { degree: 0, quality: "min7", roman: "im7" },
      ],
    },
  ],

  melancholic: [
    {
      name: "Sad Descent (i–VII–VI–V)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min", roman: "i" },
        { degree: 6, quality: "maj", roman: "VII" },
        { degree: 5, quality: "maj", roman: "VI" },
        { degree: 4, quality: "maj", roman: "V" },
      ],
    },
    {
      name: "Aeolian Sorrow (im7–ivm7–♭VImaj7–♭VII)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 3, quality: "min7", roman: "ivm7" },
        { degree: 5, quality: "maj7", roman: "♭VImaj7" },
        { degree: 6, quality: "maj", roman: "♭VII" },
      ],
    },
    {
      name: "Weeping (vim7–IVmaj7–Imaj7–iiim7)",
      mode: "major",
      steps: [
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 2, quality: "min7", roman: "iiim7" },
      ],
    },
    {
      name: "Lonely Walk (im9–♭VImaj7–ivm7–V7)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min9", roman: "im9" },
        { degree: 5, quality: "maj7", roman: "♭VImaj7" },
        { degree: 3, quality: "min7", roman: "ivm7" },
        { degree: 4, quality: "dom7", roman: "V7" },
      ],
    },
  ],

  anxious: [
    {
      name: "Tritone Tension (i–♭V–iv–i)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min", roman: "i" },
        { degree: 3, quality: "dim", roman: "♭V°" },
        { degree: 3, quality: "min", roman: "iv" },
        { degree: 0, quality: "min", roman: "i" },
      ],
    },
    {
      name: "Restless (im7–iiø7–V7–im7)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 1, quality: "min7b5", roman: "iiø7" },
        { degree: 4, quality: "dom7", roman: "V7" },
        { degree: 0, quality: "min7", roman: "im7" },
      ],
    },
    {
      name: "Unstable Ground (i–♭II–V7–♭VI)",
      mode: "phrygian",
      steps: [
        { degree: 0, quality: "min", roman: "i" },
        { degree: 1, quality: "maj", roman: "♭II" },
        { degree: 4, quality: "dom7", roman: "V7" },
        { degree: 5, quality: "maj", roman: "♭VI" },
      ],
    },
    {
      name: "Nervous Loop (im7–v7–♭VImaj7–♭VII)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 4, quality: "min7", roman: "vm7" },
        { degree: 5, quality: "maj7", roman: "♭VImaj7" },
        { degree: 6, quality: "maj", roman: "♭VII" },
      ],
    },
  ],

  angry: [
    {
      name: "Power Minor (i–♭VII–♭VI–V)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min", roman: "i" },
        { degree: 6, quality: "maj", roman: "♭VII" },
        { degree: 5, quality: "maj", roman: "♭VI" },
        { degree: 4, quality: "maj", roman: "V" },
      ],
    },
    {
      name: "Phrygian Rage (i–♭II–iv–i)",
      mode: "phrygian",
      steps: [
        { degree: 0, quality: "min", roman: "i" },
        { degree: 1, quality: "maj", roman: "♭II" },
        { degree: 3, quality: "min", roman: "iv" },
        { degree: 0, quality: "min", roman: "i" },
      ],
    },
    {
      name: "Diminished Fury (i–vii°7–♭VI–V7)",
      mode: "minor",
      steps: [
        { degree: 0, quality: "min", roman: "i" },
        { degree: 6, quality: "dim7", roman: "vii°7" },
        { degree: 5, quality: "maj", roman: "♭VI" },
        { degree: 4, quality: "dom7", roman: "V7" },
      ],
    },
  ],

  hopeful: [
    {
      name: "Rising Hope (IV–V–vi–I)",
      mode: "major",
      steps: [
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 4, quality: "maj", roman: "V" },
        { degree: 5, quality: "min", roman: "vi" },
        { degree: 0, quality: "maj", roman: "I" },
      ],
    },
    {
      name: "Dawn (Imaj7–iiim7–IVmaj7–V)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 2, quality: "min7", roman: "iiim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 4, quality: "maj", roman: "V" },
      ],
    },
    {
      name: "Mixolydian Sunrise (I–♭VII–IV–I)",
      mode: "mixolydian",
      steps: [
        { degree: 0, quality: "maj", roman: "I" },
        { degree: 6, quality: "maj", roman: "♭VII" },
        { degree: 3, quality: "maj", roman: "IV" },
        { degree: 0, quality: "maj", roman: "I" },
      ],
    },
    {
      name: "Gentle Resolve (IVadd9–V–Imaj7–vim7)",
      mode: "major",
      steps: [
        { degree: 3, quality: "add9", roman: "IVadd9" },
        { degree: 4, quality: "maj", roman: "V" },
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 5, quality: "min7", roman: "vim7" },
      ],
    },
  ],

  contemplative: [
    {
      name: "Dorian Meditation (im7–IVmaj7–im7–vm7)",
      mode: "dorian",
      steps: [
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 0, quality: "min7", roman: "im7" },
        { degree: 4, quality: "min7", roman: "vm7" },
      ],
    },
    {
      name: "Inner Dialogue (Imaj7–iiim7–vim7–IVmaj7)",
      mode: "major",
      steps: [
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 2, quality: "min7", roman: "iiim7" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
      ],
    },
    {
      name: "Philosophical (iim7–V7–Imaj7–vim7)",
      mode: "major",
      steps: [
        { degree: 1, quality: "min7", roman: "iim7" },
        { degree: 4, quality: "dom7", roman: "V7" },
        { degree: 0, quality: "maj7", roman: "Imaj7" },
        { degree: 5, quality: "min7", roman: "vim7" },
      ],
    },
    {
      name: "Still Water (Isus2–vim7–IVmaj7–Isus2)",
      mode: "major",
      steps: [
        { degree: 0, quality: "sus2", roman: "Isus2" },
        { degree: 5, quality: "min7", roman: "vim7" },
        { degree: 3, quality: "maj7", roman: "IVmaj7" },
        { degree: 0, quality: "sus2", roman: "Isus2" },
      ],
    },
  ],
};

// ── Main generation function ─────────────────────────────────────────

export function generateProgression(
  moodId: string,
  key: NoteName
): ChordProgression {
  const templates = MOOD_PROGRESSIONS[moodId];
  if (!templates) {
    throw new Error(`Unknown mood: ${moodId}`);
  }

  const template = templates[Math.floor(Math.random() * templates.length)];
  const chords = template.steps.map((step) =>
    getScaleDegreeChord(key, template.mode, step.degree, step.quality, step.roman)
  );

  const mood = MOODS.find((m) => m.id === moodId);

  return {
    chords,
    key,
    mode: template.mode,
    mood: mood?.name ?? moodId,
    name: template.name,
  };
}

// ── MIDI helpers for piano roll ──────────────────────────────────────

export function midiToNoteName(midi: number): string {
  const note = ALL_NOTES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export const KEY_OPTIONS: NoteName[] = ALL_NOTES;
