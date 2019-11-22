import { React, ReactDOM } from "../../src";

const container = document.getElementById("root");

function Counter() {
  const [state, setState] = React.useState(1);
  return <h1 onClick={() => setState(c => c + 1)}>Count: {state}</h1>;
}

const element = <Counter />;
ReactDOM.render(element, container);
