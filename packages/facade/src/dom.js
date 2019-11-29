// const isGone = (prev, next) => key => !(key in next);
import { updateEvents } from "./event";
import { updateProps } from "./props";

export function updateDom(dom, prevProps, nextProps) {
  updateEvents(dom, prevProps, nextProps);
  updateProps(prevProps, nextProps, dom);
}

export function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
  return dom;
}
