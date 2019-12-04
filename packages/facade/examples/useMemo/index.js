import { React, ReactDOM } from "../../src";
// import React from "react";
// import ReactDOM from "react-dom";
const { useState, useEffect, useMemo } = React;
const { render } = ReactDOM;

function Counter() {
  const [count, setCount] = useState(0);
  const one = useMemo(() => 1, []);

  console.log(one);
  useEffect(() => {
    console.log(111);
  });
  return (
    <div>
      <h1>
        {count}-{one}
      </h1>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>
    </div>
  );
}

render(<Counter />, document.getElementById("root"));
