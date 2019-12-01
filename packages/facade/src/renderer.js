export let renderer = {
  nextUnitOfWork: null, //  需要处理的下一个fiber对象, 浏览器空闲的时候会处理
  wipRoot: null, // 本次更新的wip, 根节点
  wipFiber: null, // 正在被处理的fiber节点
  currentRoot: null, // commit阶段被赋值,下次更新的alternate
  deletions: []
};
