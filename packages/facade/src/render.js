import { createDom, updateDom } from "./dom";

let nextUnitOfWork = null; //  需要处理的下一个fiber对象
let wipRoot = null; // workInProgress树, #root对应的节点
let currentRoot = null; // 只有在commit阶段才被赋值
let deletions = null; // 收集被删除的对象

export function render(element, container) {
  // 如果是#root根节点, 创建rootFiber
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    // 关键点: 更新操作是通过与alternate对象的比对来完成的
    // currentRoot只有在effect收集结束, 进行commit阶段才会被赋值
    // reconciliation的两个阶段: effect(节点变更收集), commit(将effect更新到dom)
    // effect收集阶段利用requestIdleCallback, 可以中断
    // 每次commit阶段都会从fiberRoot节点开始, 不能中断, 中断之后需要从头开始
    alternate: currentRoot // alternate指向旧的workInProgress树
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child); // 从<App />节点开始更新
  currentRoot = wipRoot;
  wipRoot = null;
}

// 通过递归的方式遍历整棵树
function commitDeletion(domParent, fiber) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(domParent, fiber.child);
  }
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  let domParentFiber = fiber.parent;
  // 函数组件没有dom, 需要不断向上查找找到有dom的父节点
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(domParent, fiber);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 工作循环, 使得更新的处理能够中断
// 只要浏览器有空闲时间, 就会回来处理下一个fiber
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  //进入commit阶段
  if (!nextUnitOfWork && wipRoot) {
    commitRoot(wipRoot.child);
  }
  requestIdleCallback(workLoop);
}

// 处理当前fiber, 对dom节点进行增, 删, 改
// 并返回下一个需要处理的fiber对象
function updateHostComponent(fiber) {
  // 初次渲染, dom节点还没有生成,根据fiber逐步生成dom树
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // 遍历children, 为创建新的fiber对象, 建立fiberTree
  const elements = fiber.props.children;
  // reconcileChildren
  reconcileChildren(fiber, elements);
}

function updateFunctionalComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = []; // 搜集该组件的变化,允许多次setState
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  const isFunctionalComponent = fiber.type instanceof Function;
  if (isFunctionalComponent) {
    updateFunctionalComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  // 返回下一个要处理的fiber对象
  // 如果有子元素, 返回第一个子元素
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    //  无则检查sibling
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // sibling也没有就返回parent, 寻找parent.sibling
    nextFiber = nextFiber.parent;
  }
}

// 遍历children, 打tag
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  //存在则返回oldFiber的child
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    // TODO key更新支持
    const sameType = oldFiber && element && element.type == oldFiber.type;

    // 更新节点
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }

    // 新增节点
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }

    // 删除节点
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber; // 保存第一个child的索引
    } else {
      // 除了第一个子元素外, 其他的子元素通过sibling链接到整体中
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

// 将workLoop添加到requestIdleCallBack
requestIdleCallback(workLoop);

let wipFiber = null;
let hookIndex = null;

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
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };

    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
