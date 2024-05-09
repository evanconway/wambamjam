import { useEffect, useMemo, useState } from "react";
import { Pitch, usePlayPitch, useSynthKeyDown } from "../hooks";
import ShowText from "./ShowText";
import PitchChooser from "./PitchChooser";

const TextSynth = () => {
  useSynthKeyDown();
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState(
    "Click record, then type your performance...",
  );
  const [typedPerformance, setTypedPerformance] = useState<
    { text: string; time: number; pitch: Pitch }[]
  >([]);

  const addTextChangeMoment = useMemo(() => {
    const result = (newText: string) => {
      setTypedPerformance([
        ...typedPerformance,
        { text: newText, time: Date.now(), pitch: "C4" },
      ]);
    };
    return result;
  }, [typedPerformance, setTypedPerformance]);

  // TODO: check this again to see if there's a way to be more efficient
  useEffect(() => {
    if (typedPerformance.length <= 0) return;
    if (text === typedPerformance[typedPerformance.length - 1].text) return;
    addTextChangeMoment(text);
  }, [text, addTextChangeMoment, typedPerformance]);

  useEffect(() => {
    if (recording) {
      setText("");
      setTypedPerformance([{ text: "", time: Date.now(), pitch: "C4" }]);
      document.getElementsByTagName("textarea")[0].focus();
    }
  }, [recording, setTypedPerformance, setText]);

  const [playbackText, setPlaybackText] = useState(""); // the text in the playback area
  useEffect(() => {
    if (!recording) setPlaybackText(text);
  }, [text, recording, setPlaybackText]);

  const playPitch = usePlayPitch();

  // we determine if the app is "playing back" with the size of this timeout id array
  const [playbackTimeoutArr, setPlaybackTimeoutArr] = useState<number[]>([]);
  const playRecording = () => {
    if (typedPerformance.length <= 0) return;
    const timeReduce = typedPerformance[0].time;
    setPlaybackTimeoutArr(
      typedPerformance.map((moment, i) => {
        const result = setTimeout(() => {
          setPlaybackText(moment.text);
          if (i > 0) playPitch(moment.pitch);
          if (i >= typedPerformance.length - 1) setPlaybackTimeoutArr([]);
        }, moment.time - timeReduce);
        return result;
      }),
    );
  };
  const stopRecording = () => {
    for (const timeoutId of playbackTimeoutArr) {
      clearTimeout(timeoutId);
    }
    setPlaybackTimeoutArr([]);
    setPlaybackText(text);
  };

  const isPlayingBack = playbackTimeoutArr.length > 0;

  const typingElement = (
    <textarea
      disabled={!recording}
      style={{ width: "300px", height: "300px", resize: "none" }}
      placeholder={recording ? "start typing..." : "Click record to begin."}
      value={text}
      onChange={(e) => setText(e.target.value)}
    ></textarea>
  );

  const playbackElement = (
    <p
      style={{
        width: "300px",
        height: "300px",
        resize: "none",
        padding: "0.5em",
        border: isPlayingBack ? undefined : "1px solid",
      }}
    >
      {playbackText}
    </p>
  );

  const startTimeOfPlayback =
    typedPerformance.length > 0 ? typedPerformance[0].time : 0;

  const playbackPitchChooser =
    typedPerformance.length <= 0 || recording ? null : (
      <ul>
        {typedPerformance.slice(1).map((moment, i) => {
          return (
            <li key={i} style={{ marginBottom: "1em" }}>
              <div>Event {i}</div>
              <div>Time: {moment.time - startTimeOfPlayback}</div>
              <ShowText text={moment.text} />
              <div>
                pitch:{" "}
                <PitchChooser
                  pitch={moment.pitch}
                  onPitchChange={(newPitch) => {
                    setTypedPerformance(
                      typedPerformance.map((typingMoment, k) => {
                        if (k === i + 1) {
                          return { ...typingMoment, pitch: newPitch };
                        }
                        return typingMoment;
                      }),
                    );
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5em",
      }}
    >
      <button
        disabled={isPlayingBack}
        onClick={() => {
          setRecording(!recording);
        }}
      >
        {recording ? "stop" : "record"}
      </button>
      {recording ? typingElement : playbackElement}
      {typedPerformance.length > 0 && !recording ? (
        <button onClick={isPlayingBack ? stopRecording : playRecording}>
          {isPlayingBack ? "Stop" : "Play"}
        </button>
      ) : null}
      {playbackPitchChooser}
    </div>
  );
};

export default TextSynth;
