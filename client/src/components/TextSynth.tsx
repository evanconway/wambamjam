import { useState } from "react";
import { useSynthKeyDown } from "../hooks";

const TextSynth = () => {
  const [text, setText] = useState("");

  useSynthKeyDown();

  return (
    <div>
      <textarea
        style={{ width: "300px", height: "300px" }}
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
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
