import { renderer } from "./renderer";
import { wipFiber } from "./reconciler";

let hookIndex = null;
export function resetHookIndex() {
  hookIndex = 0;
}

export function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  const setState = action => {
    hook.queue.push(action);
    renderer.wipRoot = {
      dom: renderer.currentRoot.dom,
      props: renderer.currentRoot.props,
      alternate: renderer.currentRoot
    };

    renderer.nextUnitOfWork = renderer.wipRoot; // 从root节点开始更新
    renderer.deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
