export function render(element, rootElement) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // 将其他的非children props挂载到当前元素上
  const isProperty = key => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });

  // 递归调用子节点进行渲染
  element.props.children.forEach(child => {
    render(child, dom);
  });

  rootElement.appendChild(dom);
}
