import { isFn, wipFiber, wipRoot, scheduleWork } from "./reconciler";

let hookIndex = 0;

export function resetHookIndex() {
  hookIndex = 0;
}

export function useState(initialVal) {
  return useReducer(null, initialVal);
}

// 每次调用函数组件的构造函数时, 会执行里面的函数
export function useReducer(reducer, initialVal) {
  // 一个组件上可以有多个hook,根据index进行区分， 每个hook里面可以有多个action
  const hook = getHook(hookIndex++);

  const setState = value => {
    let newValue = reducer
      ? reducer(hook[0], value)
      : isFn(value)
      ? value(hook[0])
      : value;

    hook[0] = newValue;
    scheduleWork(wipRoot, false);
  };
  if (hook.length) {
    return [hook[0], setState];
  } else {
    hook[0] = initialVal;
    return [initialVal, setState];
  }
}

function getHook(index) {
  let hooks =
    wipFiber.hooks || (wipFiber.hooks = { list: [], effect: [], cleanup: [] });
  if (index >= hooks.list.length) {
    hooks.list.push([]);
  }
  return hooks.list[index] || [];
}
