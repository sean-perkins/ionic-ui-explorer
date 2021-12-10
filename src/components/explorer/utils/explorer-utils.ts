import { WebComponentNode } from "../types";

/**
 * Queries all web component nodes starting at the target element.
 * @param target The element to start DOM traversing at.
 * @returns A nested object of the host elements, the web component children and
 * if the element is a web component node.
 */
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

/**
 * Parses the stylesheet of a shadow DOM to fetch all available
 * CSS variables that existing within the `:host` selector.
 * @param target The element to pierce and query CSS variables from.
 * @returns Multi-dimensional array of the CSS variable name and value.
 */
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

/**
 * Queries CSS Shadow Parts within a shadow DOM.
 * @param el The element to pierce and query shadow parts from.
 * @returns The array of shadow part HTML elements.
 */
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
