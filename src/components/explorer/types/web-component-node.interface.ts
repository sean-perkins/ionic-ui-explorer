export interface WebComponentNode {
  /**
   * Reference to the HTMLElement.
   */
  el: HTMLElement,
  /**
   * `true` if the HTMLElement is a web component.
   */
  isWebComponent: boolean,
  /**
   * The list of children of the HTMLElement that are web components.
   */
  children: WebComponentNode[];
  /**
   * Unique identifier for each layer of the DOM tree.
   */
  uid: string;
}
