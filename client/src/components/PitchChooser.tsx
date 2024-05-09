import { Pitch, pitches } from "../hooks";

const PitchChooser = ({
  pitch,
  onPitchChange,
}: {
  pitch: Pitch;
  onPitchChange: (pitch: Pitch) => void;
}) => {
  return (
    <select
      value={pitch}
      onChange={(e) => onPitchChange(e.target.value as Pitch)}
    >
      {pitches.map((p) => (
        <option value={p}>{p}</option>
      ))}
    </select>
  );
};

export default PitchChooser;
