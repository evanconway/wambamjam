import { useState } from "react";
import TextSynth from "./components/TextSynth";

function App() {
  const [begun, setBegun] = useState(false);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Typing Performance</h1>
      {begun ? (
        <TextSynth />
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={() => setBegun(true)}>Click To Start!</button>
        </div>
      )}
    </div>
  );
}

export default App;
