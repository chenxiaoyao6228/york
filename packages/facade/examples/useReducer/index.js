import { React, ReactDOM } from "../../src";

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
  const [state, dispatch] = React.useReducer(reducer, initialState);
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
ReactDOM.render(element, container);
