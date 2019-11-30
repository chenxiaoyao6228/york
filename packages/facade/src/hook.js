import { renderer } from "./renderer";
import { wipFiber } from "./reconciler";

let hookIndex = null;
export function resetHookIndex() {
  hookIndex = 0;
}

export function useState(initial) {
  return useReducer(null, initial);
}

export function useReducer(reducer, initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  //  创建一个hook对象
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };
  // 更新hook的值
  const actions = oldHook ? oldHook.queue : [];
  // 多次的setState实际上会集合到一次上
  actions.forEach(action => {
    hook.state = action(hook.state);
  });
  wipFiber.hooks.push(hook);
  hookIndex++;
  // 每个hook对象里面有一个队列, 用于保存一次更新内的多次变化
  const setState = action => {
    hook.queue.push(action);
    renderer.wipRoot = {
      dom: renderer.currentRoot.dom,
      props: renderer.currentRoot.props,
      alternate: renderer.currentRoot
    };

    renderer.nextUnitOfWork = renderer.wipRoot;
    renderer.deletions = [];
  };
  return [hook.state, setState];
}
