import { isFn, wipFiber, scheduleWork, scheduling } from "./reconciler";

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
    if (scheduling) return;
    let newValue = reducer
      ? reducer(hook[0], value)
      : isFn(value)
      ? value(hook[0])
      : value;

    hook[0] = newValue;
    scheduleWork(wipFiber, true);
  };
  if (hook.length) {
    return [hook[0], setState];
  } else {
    hook[0] = initialVal;
    return [initialVal, setState];
  }
}

function getHook(index) {
  if (!wipFiber.hooks) {
    if (wipFiber.alternate && wipFiber.alternate.hooks) {
      wipFiber.hooks = {};
      wipFiber.hooks.list = wipFiber.alternate.hooks.list.slice(); // 层层闭包查找
    } else {
      wipFiber.hooks = { list: [], effect: [], cleanup: [] };
    }
  }
  if (index >= wipFiber.hooks.list.length) {
    wipFiber.hooks.list.push([]);
  }
  return wipFiber.hooks.list[index];
}
