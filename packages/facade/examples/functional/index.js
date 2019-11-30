import { React, ReactDOM } from "../../src";

const container = document.getElementById("root");

function Counter() {
  const [state, setState] = React.useState(1);
  const handleClick = function() {
    setState(c => c + 1);
    setState(c => c + 2);
  };
  return <h1 onClick={handleClick}>Count: {state}</h1>;
}

const element = <Counter />;
ReactDOM.render(element, container);
