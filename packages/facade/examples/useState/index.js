import { React, ReactDOM } from "../../src";

const container = document.getElementById("root");

function Counter() {
  const [state1, setState1] = React.useState(0);
  // const [state2, setState2] = React.useState(0);
  const handler = () => {
    setState1(function(c) {
      return c + 1;
    });
  };
  return <button onClick={handler}>{state1}</button>;
}

// setCount(count + 1)这种setState的形式
// function Counter() {
// 	const [count, setCount] = React.useState(0);

// 	function handleAlertClick() {
// 		setTimeout(() => {
// 			alert('You clicked on: ' + count);
// 		}, 3000);
// 	}

// 	return (
// 		<div>
// 			<p>You clicked {count} times</p>
// 			<button onClick={() => setCount(count => count + 1)}>Click me</button>
// 			<button onClick={handleAlertClick}>Show alert</button>
// 		</div>
// 	);
// }

// function Counter() {
// 	const [count, setCount] = React.useState(0);

// 	function handleAlertClick() {
// 		setTimeout(() => {
// 			alert('You clicked on: ' + count);
// 		}, 3000);
// 	}

// 	return (
// 		<div>
// 			<p>You clicked {count} times</p>
// 			<button onClick={() => setCount(count => count + 1)}>Click me</button>
// 			<button onClick={handleAlertClick}>Show alert</button>
// 		</div>
// 	);
// }
console.log(222);
const element = <Counter />;
ReactDOM.render(element, container);
