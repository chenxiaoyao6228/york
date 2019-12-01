import { createElement } from "./element";
import { render } from "./reconciler";
import { useState, useReducer } from "./hook";
export const React = {
  createElement,
  useState,
  useReducer
};

export const ReactDOM = {
  render
};
