import { useEffect, useMemo, useState } from "react";
import { useSynthKeyDown } from "../hooks";

const TextSynth = () => {
  useSynthKeyDown();
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const [typedPerformance, setTypedPerformance] = useState<
    { text: string; time: number }[]
  >([]);

  const addTextChangeMoment = useMemo(() => {
    const result = (newText: string) => {
      setTypedPerformance([
        ...typedPerformance,
        { text: newText, time: Date.now() },
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
      setTypedPerformance([{ text: "", time: Date.now() }]);
      document.getElementsByTagName("textarea")[0].focus();
    }
  }, [recording, setTypedPerformance, setText]);

  const [playbackText, setPlaybackText] = useState(""); // the text in the playback area
  useEffect(() => {
    if (!recording) setPlaybackText(text);
  }, [text, recording, setPlaybackText]);

  // we determine if the app is "playing back" with the size of this timeout id array
  const [playbackTimeoutArr, setPlaybackTimeoutArr] = useState<number[]>([]);
  const playRecording = () => {
    if (typedPerformance.length <= 0) return;
    const timeReduce = typedPerformance[0].time;
    setPlaybackTimeoutArr(
      typedPerformance.map((moment, i) => {
        const result = setTimeout(() => {
          setPlaybackText(moment.text);
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
        border: "1px solid black",
      }}
    >
      {playbackText}
    </p>
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
    </div>
  );
};

export default TextSynth;
