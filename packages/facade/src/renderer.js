// renderer保存全局变量
class Renderer {
  constructor() {
    // nextUnitOfWork和wip共同处理fiber树的遍历问题
    this.nextUnitOfWork = null; //  需要处理的下一个fiber对象, 浏览器空闲的时候会处理
    this.wipRoot = null; // 本次更新的wip, 根节点
    this.currentRoot = null; // commit阶段被赋值,下次更新的alternate
    this.deletion = null;
  }
}
export const renderer = new Renderer();
