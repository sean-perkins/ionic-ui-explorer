import { Component, Event, h, Prop, EventEmitter } from "@stencil/core";
import { WebComponentNode } from "../explorer/types";


@Component({
  tag: 'app-tree',
  styleUrl: 'tree.css',
  shadow: true
})
export class Tree {
  /**
   * The nested structure of web component element nodes to
   * display in a nested list.
   */
  @Prop() node: WebComponentNode;

  /**
   * The inspect button for a specific element was selected.
   * Emits the `HTMLElement` of the tag selected.
   */
  @Event() inspect: EventEmitter<HTMLElement>;

  /**
   * Emits the element to start highlighting in the canvas.
   */
  @Event() highlightStart: EventEmitter<HTMLElement>;

  /**
   * Emits the element to remove highlighting in the canvas.
   */
  @Event() highlightEnd: EventEmitter<HTMLElement>;

  private inspectButtonClicked(node: WebComponentNode) {
    this.inspect.emit(node.el)
  }

  private tagNameMouseEnter(ev: MouseEvent, node: WebComponentNode) {
    const target = ev.target as HTMLElement;
    if (target.querySelector('ul')) {
      return;
    }
    if (target.id === node.uid) {
      this.highlightStart.emit(node.el);
    }
  }

  private tagNameMouseLeave(node: WebComponentNode) {
    this.highlightEnd.emit(node.el);
  }

  private renderBranch(node: WebComponentNode) {
    return node.isWebComponent && (
      <ul role='tree'>
        <li>
          <div class='tree__branch'>
            <div class='tree__branch-header'>
              <div class='tree__branch-header-inner'>
                <input
                  type='checkbox'
                  checked={getComputedStyle(node.el).display !== 'none'}
                  onChange={ev => {
                    const { checked } = ev.target as HTMLInputElement;
                    node.el.style.display = checked ? '' : 'none';
                  }} />
                <div class='tree__node-name' id={node.uid}
                  onMouseEnter={(ev) => this.tagNameMouseEnter(ev, node)}
                  onMouseLeave={() => this.tagNameMouseLeave(node)}>
                  {`<${node.el.tagName.toLowerCase()}>`}
                </div>
              </div>
              <button
                class='tree__inspect-btn'
                type='button' onClick={() => this.inspectButtonClicked(node)}>(Inspect)</button>
            </div>
            {
              node.children.length > 0 && node.children.map(child => this.renderBranch(child))
            }
          </div>
        </li>
      </ul>
    );
  }

  render() {
    const { node } = this;
    return this.renderBranch(node);
  }
}
