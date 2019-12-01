import { renderer } from "./renderer";

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
  const oldHook =
    renderer.wipFiber.alternate &&
    renderer.wipFiber.alternate.hooks &&
    renderer.wipFiber.alternate.hooks[hookIndex];

  const state = oldHook ? oldHook.state : initialVal;

  const hook = {
    state: state,
    actions: [] // action队列
  };
  // 更新hook的值
  const actions = oldHook ? oldHook.actions : [];
  // 多次的setState实际上会集合到一次上

  actions.forEach(action => {
    hook.state =
      action instanceof Function
        ? action(hook.state)
        : reducer(hook.state, action);
  });
  renderer.wipFiber.hooks.push(hook);
  // 处理下一个hook
  hookIndex++;
  // 每个hook对象里面有一个队列, 用于保存一次更新内的多次变化
  // action可能是对象, 或者函数
  const dispatch = action => {
    hook.actions.push(action);

    // scheduleWork
    renderer.wipRoot = {
      dom: renderer.currentRoot.dom,
      props: renderer.currentRoot.props,
      alternate: renderer.currentRoot
    };
    renderer.nextUnitOfWork = renderer.wipRoot;
    renderer.deletions = [];
  };
  return [hook.state, dispatch];
}
