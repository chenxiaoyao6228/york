import { createDom, updateDom } from "./dom";
import { renderer } from "./renderer";
import { resetHookIndex } from "./hook";

export let wipFiber = null; // 当前正在被处理的fiber对象
export function render(vnode, container) {
  // 从wipRoot开始，不断构建wip
  renderer.wipRoot = {
    dom: container,
    props: {
      children: [vnode]
    },
    // currentRoot只有在effect收集结束, 进行commit阶段才会被赋值
    alternate: renderer.currentRoot // alternate指向旧的workInProgress树
  };
  renderer.deletions = [];
  renderer.nextUnitOfWork = renderer.wipRoot;
  requestIdleCallback(workLoop);
}

// 处理当前节点， 返回下一个待处理的节点
function workLoop(deadline) {
  let shouldYield = false;
  while (renderer.nextUnitOfWork && !shouldYield) {
    renderer.nextUnitOfWork = performUnitOfWork(renderer.nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  //进入commit阶段
  if (!renderer.nextUnitOfWork && renderer.wipRoot) {
    commitRoot(renderer.wipRoot.child);
  }
  requestIdleCallback(workLoop);
}

// 从<App />节点开始
function performUnitOfWork(fiber) {
  const isFunctionalComponent = fiber.type instanceof Function;
  // TODO class component支持
  if (isFunctionalComponent) {
    updateFunctionalComponent(fiber);
  } else {
    updateHostComponent(fiber); // 更新浏览器宿主,也就是原生dom
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

function commitRoot() {
  renderer.deletions.forEach(commitWork);
  commitWork(renderer.wipRoot.child); // 从<App />节点开始更新

  // 更新完成,清空
  renderer.currentRoot = renderer.wipRoot; //
  renderer.wipRoot = null;
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

// 处理当前fiber, 对dom节点进行增, 删, 改
// 并返回下一个需要处理的fiber对象
function updateHostComponent(fiber) {
  // 初次渲染, dom节点还没有生成,根据fiber逐步生成dom树
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // 遍历children, 为创建新的fiber对象, 建立fiberTree
  const children = fiber.props.children;
  // 遍历children, 1.建立sibling关系, 2.打tag
  reconcileChildren(fiber, children);
}

function updateFunctionalComponent(fiber) {
  wipFiber = fiber;
  resetHookIndex();
  wipFiber.hooks = []; // 搜集该组件的变化,允许多次setState
  const children = [fiber.type(fiber.props)]; // type为函数
  reconcileChildren(fiber, children);
}

// 从dom树建立sibling关系只能通过parent.children的遍历来建立
function reconcileChildren(wipFiber, children) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 拿到子节点的fiber对象
  // 建立一个dummyHead节点,第一个child是它的next节点, 通过不断移动, 建立完整的链条
  let prevSibling = null;

  while (index < children.length || oldFiber != null) {
    const child = children[index];
    let newFiber = null;
    // TODO key更新支持
    const sameType = oldFiber && child && child.type == oldFiber.type;

    // 更新节点
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: child.props,
        dom: oldFiber.dom,
        parent: wipFiber, // parent属性用于dom节点的增加,删除，修改
        alternate: oldFiber, // 每个节点都有一个alternate对象指向旧的fiber
        effectTag: "UPDATE"
      };
    }

    // 新增节点
    if (child && !sameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }

    // 删除节点
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      renderer.deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber; // 保存第一个child的索引
    } else {
      // 除了第一个子元素外, 其他的子元素通过sibling链接到整体中
      // 此时标有'DELETION'的节点的fiber已经脱离整个fiber链条,commit阶段删除该不点不会对wip造成影响
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
