import { React, ReactDOM } from "../../src";
// import React from "react";
// import ReactDOM from "react-dom";
const { useState, useEffect } = React;
const { render } = ReactDOM;

const container = document.getElementById("root");

function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [count]);
  const handler = () => {
    console.log("111");
    setCount(c => c + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handler}>+</button>
    </div>
  );
}

const element = <Counter />;
render(element, container);
