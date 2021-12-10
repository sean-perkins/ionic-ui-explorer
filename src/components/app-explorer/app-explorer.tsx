import { Component, ComponentInterface, h, Host, Element, State } from "@stencil/core";
import { WebComponentNode } from "./types";
import { getCssShadowParts, getCssVariablesForShadowEl, getWebComponentNodes } from "./utils/explorer-utils";
import { ZoomInIcon } from "./icons/zoom-in";
import { ZoomOutIcon } from "./icons/zoom-out";
import { ZoomResetIcon } from "./icons/zoom-reset";

@Component({
  tag: 'app-explorer',
  styleUrl: 'app-explorer.css',
  shadow: true,
})
export class AppExplorer implements ComponentInterface {

  @State() private cssVariables: string[][] = [];
  @State() private cssShadowParts: HTMLElement[] = [];

  @State() private hoveredShadowPart: HTMLElement;
  @State() private activeShadowPart: HTMLElement;

  @State() private components: WebComponentNode;

  @State() private activeTabIndex = 0;
  @State() private zoomFactor = 100;

  private targetEl: HTMLElement;
  private activeTargetEl: HTMLElement;

  @Element() el: HTMLElement;

  constructor() {
    this.activeTabChange = this.activeTabChange.bind(this);
  }

  componentDidLoad() {
    this.targetEl = this.activeTargetEl = this.el.children[0] as HTMLElement;

    this.cssVariables = getCssVariablesForShadowEl(this.targetEl);
    this.cssShadowParts = getCssShadowParts(this.targetEl);
    this.components = getWebComponentNodes(this.targetEl);

    const hostEl = this.targetEl.shadowRoot ?? this.targetEl;

    this.attachMouseMoveListener(hostEl);
    this.attachClickListener(hostEl);

  }

  private attachMouseMoveListener(host: HTMLElement | ShadowRoot) {
    host.addEventListener('mousemove', e => {
      const target = e.target as HTMLElement;
      if (!target.hasAttribute('part')) {
        this.hoveredShadowPart = null;
        return;
      }
      this.hoveredShadowPart = this.cssShadowParts.find(part => part === target);
      console.log('active shadow part', this.hoveredShadowPart);
    })
  }

  private attachClickListener(host: HTMLElement | ShadowRoot) {
    host.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (!target.hasAttribute('part')) {
        this.activeShadowPart = null;
        return;
      }
      this.activeShadowPart = this.cssShadowParts.find(part => part === target);
    })
  }

  private cssValueUpdated(ev: CustomEvent) {
    const { name, value } = ev.detail;
    this.activeTargetEl.style.setProperty(name, value);
  }

  private activeTabChange(ev: CustomEvent<number>) {
    this.activeTabIndex = ev.detail;
  }

  private canvasZoomIn() {
    this.setZoom(this.zoomFactor + 15);
  }

  private canvasZoomOut() {
    this.setZoom(this.zoomFactor - 15);
  }

  private setZoom(factor: number) {
    if (factor > 50 && factor < 300) {
      this.zoomFactor = factor;
    }
  }

  private renderComponent(component: WebComponentNode) {
    return component.isWebComponent && (
      <ul>
        <li>
          <div>
            <p class='explorer__component-tag-name' id={component.uid}
              onClick={() => {
                this.activeTargetEl = component.el;
                this.cssVariables = getCssVariablesForShadowEl(component.el);
                this.cssShadowParts = getCssShadowParts(component.el);
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                if (target.querySelector('ul')) {
                  return;
                }
                if (target.id === component.uid) {
                  component.el.style.outline = '2px solid red';
                }
              }} onMouseLeave={() => {
                component.el.style.outline = '';
              }}>{component.el.tagName}</p>
            {component.children.length > 0 && component.children.map(c => this.renderComponent(c))}
          </div>
        </li>
      </ul>
    )
  }

  private renderComponentsTab() {
    const { components } = this;
    return (
      <div class='explorer__elements'>
        {
          components && this.renderComponent(components)
        }
      </div>
    )
  }

  private renderCssVariablesTab() {
    const { cssVariables } = this;
    return (
      <section id='css-variables'>
        <app-knob-css-variable-list items={cssVariables} onVariableChange={(ev) => this.cssValueUpdated(ev)}></app-knob-css-variable-list>
      </section>
    )
  }

  private renderCssShadowParts() {
    const { cssShadowParts } = this;
    return (
      <section id='css-shadow-parts'>
        <app-knob-css-shadow-part-list items={cssShadowParts}></app-knob-css-shadow-part-list>
      </section>
    )
  }

  render() {
    return (
      <Host>
        <div class='explorer__tabs'>
          <div class='explorer__tab-bar'>
            <app-tab-button active={true}>Canvas</app-tab-button>
            <span class='explorer__tab-separator'></span>
            <button
              class='explorer__tab-control'
              type='button'
              aria-label='Zoom in'
              onClick={() => this.canvasZoomIn()}>
              <ZoomInIcon />
            </button>
            <button
              class='explorer__tab-control'
              type='button'
              aria-label='Zoom out'
              onClick={() => this.canvasZoomOut()}>
              <ZoomOutIcon />
            </button>
            <button
              class='explorer__tab-control'
              type='button'
              aria-label='Zoom reset'
              onClick={() => this.setZoom(100)}>
              <ZoomResetIcon />
            </button>
          </div>
          <div class='explorer__tab-content'>
            <div class='explorer__canvas' id='explorer-component' style={{
              zoom: `${this.zoomFactor}%`
            }}>
              <slot />
            </div>
          </div>
        </div>
        <div class='explorer__tabs'>
          <div class='explorer__tab-bar'>
            <div role='tablist'>
              <app-tab-button
                active={this.activeTabIndex === 0}
                index={0}
                onTabChange={this.activeTabChange}>Component Explorer</app-tab-button>
              <app-tab-button
                active={this.activeTabIndex === 1}
                index={1}
                onTabChange={this.activeTabChange}>CSS Variables</app-tab-button>
              <app-tab-button
                active={this.activeTabIndex === 2}
                index={2}
                onTabChange={this.activeTabChange}>CSS Shadow Parts</app-tab-button>
            </div>
          </div>
          <div class='explorer__tab-content'>
            {{
              0: this.renderComponentsTab(),
              1: this.renderCssVariablesTab(),
              2: this.renderCssShadowParts()
            }[this.activeTabIndex]}
          </div>
        </div>
        {/* <div class='explorer__elements'>
          {
            this.components && this.renderComponent(this.components)
          }
        </div>
        <div class='explorer__tray'>
          <section id='css-variables'>
            <app-knob-css-variable-list items={this.cssVariables} onVariableChange={(ev) => this.cssValueUpdated(ev)}></app-knob-css-variable-list>
          </section>
          <section id='css-shadow-parts'>
            <app-knob-css-shadow-part-list items={this.cssShadowParts}></app-knob-css-shadow-part-list>
          </section>
        </div> */}
        {/* <section>
          <h4>Hovered Shadow Part</h4>
          <ul>
            <pre>{this.hoveredShadowPart && this.hoveredShadowPart.outerHTML}</pre>
          </ul>
        </section>
        <section>
          <h4>Selected Shadow Part</h4>
          <ul>
            <pre>{this.activeShadowPart && this.activeShadowPart.outerHTML}</pre>
          </ul>
        </section> */}
      </Host>
    )
  }

}
