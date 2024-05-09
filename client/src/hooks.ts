import { useEffect, useState } from "react";
import { Synth } from "tone";

export type Pitch =
  | "C3"
  | "D3"
  | "E3"
  | "F3"
  | "G3"
  | "A3"
  | "B3"
  | "C4"
  | "D4"
  | "E4"
  | "F4"
  | "G4"
  | "A4"
  | "B4"
  | "C5"
  | "D5"
  | "E5"
  | "F5"
  | "G5"
  | "A5"
  | "B5"
  | "C6";

export const pitches: Pitch[] = [
  "C3",
  "D3",
  "E3",
  "F3",
  "G3",
  "A3",
  "B3",
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
  "A4",
  "B4",
  "C5",
  "D5",
  "E5",
  "F5",
  "G5",
  "A5",
  "B5",
  "C6",
];

export const useSynth = () => {
  const [synth] = useState<Synth>(() => {
    const result = new Synth({
      oscillator: {
        type: "fmsquare",
        modulationType: "sawtooth",
        modulationIndex: 3,
        harmonicity: 3.4,
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1,
      },
    }).toDestination();
    return result;
  });
  return synth;
};

export const usePlayRandomPitch = () => {
  const synth = useSynth();
  return () => {
    synth.triggerAttackRelease(
      pitches[Math.floor(Math.random() * pitches.length)],
      "8n",
    );
  };
};

export const usePlayPitch = () => {
  const synth = useSynth();
  return (pitch: Pitch) => {
    synth.triggerAttackRelease(pitch, "8n");
  };
};

export const useSynthKeyDown = () => {
  const playSound = usePlayPitch();

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (
        ev.key.length !== 1 &&
        !["backspace", "enter"].includes(ev.key.toLowerCase())
      )
        return;
      playSound("C4");
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
};
