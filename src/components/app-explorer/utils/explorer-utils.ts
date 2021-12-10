import { WebComponentNode } from "../types";

export const getWebComponentNodes = (target: Element) => {
  let match: WebComponentNode = {
    el: target as HTMLElement,
    isWebComponent: isWebComponent(target),
    children: [],
    uid: randomId()
  };
  if (target.children.length > 0) {
    match.children = Array.from(target.children).map(r => getWebComponentNodes(r));
  }
  return match;
}

export const getCssVariablesForShadowEl = (target: HTMLElement) => {
  if (!target.shadowRoot) {
    return [];
  }
  const { textContent } = target.shadowRoot.querySelector('style');
  return textContent.substring(
    textContent.indexOf(':host{') + 6,
    textContent.indexOf('}')
  )
    .split(';')
    .filter(v => v.startsWith('--'))
    .map(v => {
      const style = v.split(':');
      return [style[0], style[1]];
    });
};

export const getCssShadowParts = (el: HTMLElement) => {
  if (!el.shadowRoot) {
    return [];
  }
  return Array.from(el.shadowRoot.querySelectorAll('[part]')) as HTMLElement[];
}

const isWebComponent = (el: Element) => el.tagName.includes('-');

const randomId = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
