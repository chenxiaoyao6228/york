import { React, ReactDOM } from "../../src";
// import React from 'react'
// import ReactDOM from 'react-dom'
const { useState } = React;
const { render } = ReactDOM;

const container = document.getElementById("root");
function Counter() {
  const [state, setState] = useState(0);
  const handler = () => {
    setState(function(c) {
      console.log(c);
      return c + 1;
    });
  };
  return <button onClick={handler}>{state}</button>;
}
const element = <Counter />;
render(element, container);

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
