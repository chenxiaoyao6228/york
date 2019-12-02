// import { React, ReactDOM } from "../../src";

// const container = document.getElementById("root");

// function Counter() {
//   const [count, setCount] = React.useState(0);
//   useEffect(() => {
//     const id = setInterval(() => {
//       setCount(count + 1);
//     }, 1000);
//     return () => clearInterval(id);
//   }, [count]);
//   const handler = () => {
//     console.log("111");
//     setCount(c => c + 1);
//   };

//   return (
//     <div>
//       <h1>useState</h1>
//       <p>Count1: {count}</p>
//       <button onClick={handler}>+</button>
//     </div>
//   );
// }

// const element = <Counter />;
// ReactDOM.render(element, container);
