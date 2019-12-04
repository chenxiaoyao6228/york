import { React, ReactDOM } from "../../src";
// import React from "react";
// import ReactDOM from "react-dom";
const { useReducer } = React;
const { render } = ReactDOM;

const container = document.getElementById("root");

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      Count: {state.count}
      <div>---------------</div>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </div>
  );
}

const element = <Counter />; // jsx(createElement)先执行,返回vnode
render(element, container);
