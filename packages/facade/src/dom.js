export function updateDom(dom, oldProps, newProps) {
  for (let name in { ...oldProps, ...newProps }) {
    let oldValue = oldProps[name];
    let newValue = newProps[name];

    if (oldValue == newValue || name === "children") {
      return;
    } else if (name === "style") {
      for (const k in { ...oldValue, ...newValue }) {
        if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
          dom[name][k] = (newValue && newValue[k]) || "";
        }
      }
    } else if (name[0] === "o" && name[1] === "n") {
      name = name.slice(2).toLowerCase();
      if (oldValue) dom.removeEventListener(name, oldValue);
      dom.addEventListener(name, newValue);
    } else if (name in dom && !(dom instanceof SVGElement)) {
      dom[name] = newValue == null ? "" : newValue;
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, newValue);
    }
  }
}

export function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
  return dom;
}
