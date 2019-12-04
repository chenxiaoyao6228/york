import { React, ReactDOM } from "../../src";
// import React from "react";
// import ReactDOM from "react-dom";
const { render } = ReactDOM;
const container = document.getElementById("root");

const updateValue = e => {
  rerender(e.target.value);
};

const rerender = value => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );
  render(element, container);
};

rerender("World");
