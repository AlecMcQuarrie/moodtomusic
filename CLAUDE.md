# MoodToMusic

## Version
The current version is displayed in the footer of `src/app/page.tsx`. When making changes that are deployed, always increment the version number:
- Patch (0.x.Y) for bug fixes
- Minor (0.X.0) for new features
- Major (X.0.0) for breaking changes

## Tech Stack
- Next.js (App Router) with TypeScript
- Tailwind CSS for styling
- Tone.js for audio synthesis and playback
- Deployed on Vercel

## Architecture
- `src/lib/musicTheory.ts` — Procedural chord progression generator using harmonic function transitions, modal interchange, cadence logic, and per-mood profiles. No hardcoded progressions.
- `src/lib/audioEngine.ts` — Tone.js PolySynth with fat sawtooth oscillator, chorus, reverb, and compressor. Supports variable chord durations.
- `src/components/` — React components: MoodSelector, Controls, ChordDisplay, PianoRoll (canvas-rendered).
- `src/app/page.tsx` — Main page with all state management.

## Key Rules
- Chord progressions must always sum to exactly 4 or 8 bars (16 or 32 beats). Never generate odd bar counts like 6.
- Changing key transposes the existing progression (does not regenerate). Changing BPM adjusts in real-time without regenerating.
- The user must explicitly click "Regenerate" to get a new progression.
- Always deploy with `vercel --yes --prod --scope awesome4lec-7513s-projects`.
- Dark theme only (neutral-950 background). No light mode.

## Deploy
```bash
vercel --yes --prod --scope awesome4lec-7513s-projects
```
