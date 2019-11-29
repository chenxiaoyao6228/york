// renderer保存全局变量
class Renderer {
  constructor() {
    this.nextUnitOfWork = null; //  需要处理的下一个fiber对象, 浏览器空闲的时候会处理
    this.wipRoot = null; // #root对应的根节点
    this.currentRoot = null; // 本次更新的wip, commit阶段被赋值
    this.deletion = null;
  }
}
export const renderer = new Renderer();
