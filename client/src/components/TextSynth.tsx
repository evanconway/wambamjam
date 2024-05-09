import { useEffect, useState } from "react";
import { Synth } from "tone";

const pitches = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

const TextSynth = () => {
  const [text, setText] = useState("");
  const [synth, setSynth] = useState<Synth | null>(null);

  useEffect(() => {
    const newSynth = new Synth({
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
    setSynth(newSynth);
  }, [setSynth]);

  useEffect(() => {
    if (synth === null) return;
    const onKeyDown = () => {
      synth.triggerAttackRelease(
        pitches[Math.floor(Math.random() * pitches.length)],
        "8n",
      );
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [synth]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></input>
    </div>
  );
};

export default TextSynth;
