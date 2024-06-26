import { useState } from "react";

const ShowText = ({ text }: { text: string }) => {
  return <div>Text: "{text}"</div>;
  const [show, setShow] = useState(false);
  return (
    <div>
      {show ? <p>"{text}"</p> : null}
      <button onClick={() => setShow(!show)}>
        {show ? "hide text" : "show text"}
      </button>
    </div>
  );
};

export default ShowText;
