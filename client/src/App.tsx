import { useState } from "react";
import TextSynth from "./components/TextSynth";

function App() {
  const [begun, setBegun] = useState(false);
  return begun ? (
    <TextSynth />
  ) : (
    <button onClick={() => setBegun(true)}>Click To Start!</button>
  );
}

export default App;
