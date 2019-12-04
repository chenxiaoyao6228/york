import { isFn, wipFiber, scheduleWork } from "./reconciler";

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
    scheduleWork(true);
  };
  if (hook.length) {
    return [hook[0], setState];
  } else {
    hook[0] = initialVal;
    return [initialVal, setState];
  }
}

export function useEffect(cb, deps) {
  let hook = getHook(hookIndex++);
  if (isChanged(hook[1], deps)) {
    hook[0] = useCallback(cb, deps);
    hook[1] = deps; // 更新deps
    wipFiber.hooks.effect.push(hook); //更新effect队列
  }
}

export function useMemo(cb, deps) {
  let hook = getHook(hookIndex++);
  if (isChanged(hook[1], deps)) {
    hook[1] = deps;
    return (hook[0] = cb());
  }
  return hook[0];
}

export function useCallback(cb, deps) {
  return useMemo(() => cb, deps);
}

function getHook(index) {
  if (!wipFiber.hooks) {
    if (wipFiber.alternate && wipFiber.alternate.hooks) {
      wipFiber.hooks = wipFiber.alternate.hooks;
    } else {
      wipFiber.hooks = {
        list: [],
        effect: [],
        cleanup: []
      };
    }
  }
  if (index >= wipFiber.hooks.list.length) {
    wipFiber.hooks.list.push([]);
  }
  return wipFiber.hooks.list[index] || [];
}

function isChanged(a, b) {
  return !a || b.some((arg, index) => arg !== a[index]);
}
