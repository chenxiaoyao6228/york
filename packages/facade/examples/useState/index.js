import { React, ReactDOM } from "../../src";

const container = document.getElementById("root");

function Counter() {
  const [state1, setState1] = React.useState(0);
  const [state2, setState2] = React.useState(0);
  return (
    <div>
      <h1>useState</h1>
      <p>Count1: {state1}</p>
      <button onClick={() => setState1(c => c + 1)}>+</button>
      <p>Count2: {state2}</p>
      <button onClick={() => setState2(c => c + 1)}>+</button>
    </div>
  );
}
const element = <Counter />;
ReactDOM.render(element, container);

// useReducer
