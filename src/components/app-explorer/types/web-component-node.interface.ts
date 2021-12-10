export interface WebComponentNode {
  el: HTMLElement,
  isWebComponent: boolean,
  children: WebComponentNode[];
  uid: string;
}
