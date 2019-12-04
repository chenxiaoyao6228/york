import { createElement } from "./element";
import { render } from "./reconciler";
import { useState, useReducer, useCallback, useEffect, useMemo } from "./hook";
export const React = {
  createElement,
  useState,
  useReducer,
  useMemo,
  useEffect,
  useCallback
};

export const ReactDOM = {
  render
};
