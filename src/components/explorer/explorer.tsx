import { Component, ComponentInterface, h, Host, Element, State, Prop } from "@stencil/core";
import { WebComponentNode } from "./types";
import { getCssShadowParts, getCssVariablesForShadowEl, getWebComponentNodes } from "./utils/explorer-utils";
import { ZoomInIcon } from "./icons/zoom-in";
import { ZoomOutIcon } from "./icons/zoom-out";
import { ZoomResetIcon } from "./icons/zoom-reset";

@Component({
  tag: 'app-explorer',
  styleUrl: 'explorer.css',
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

  @State() private inspectorWidth: number;
  @State() private inspectorHeight: number;
  @State() private inspectorX: number;
  @State() private inspectorY: number;

  private targetEl: HTMLElement;
  private activeTargetEl: HTMLElement;
  private frameEl: HTMLIFrameElement;

  @Element() private el: HTMLElement;

  // Not supported (need to frame remote content)
  @Prop() frameSrc: string;

  @Prop() i18n = {
    zoom_out: 'Zoom out',
    zoom_in: 'Zoom in',
    zoom_reset: 'Zoom reset',
    canvas: 'Canvas',
    component_explorer: 'Component Explorer',
    css_variables: 'CSS Variables',
    css_shadow_parts: 'CSS Shadow Parts'
  }

  constructor() {
    this.activeTabChange = this.activeTabChange.bind(this);
  }

  componentDidLoad() {
    if (this.frameEl) {
      this.targetEl = this.activeTargetEl = this.frameEl.querySelector('body').firstElementChild as HTMLElement;
    } else {
      this.targetEl = this.activeTargetEl = this.el.children[0] as HTMLElement;
    }

    if (this.targetEl) {
      this.cssVariables = getCssVariablesForShadowEl(this.targetEl);
      this.cssShadowParts = getCssShadowParts(this.targetEl);
      this.components = getWebComponentNodes(this.targetEl);

      const hostEl = this.targetEl.shadowRoot ?? this.targetEl;

      this.attachMouseMoveListener(hostEl);
      this.attachClickListener(hostEl);
    }

  }

  private attachMouseMoveListener(host: HTMLElement | ShadowRoot) {
    host.addEventListener('mousemove', e => {
      const target = e.target as HTMLElement;
      if (!target.hasAttribute('part')) {
        this.hoveredShadowPart = null;
        return;
      }
      this.hoveredShadowPart = this.cssShadowParts.find(part => part === target);
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

  private inspect(el: HTMLElement) {
    this.activeTargetEl = el;
    this.cssVariables = getCssVariablesForShadowEl(el);
    this.cssShadowParts = getCssShadowParts(el);
  }

  private highlightCanvasEl(el: HTMLElement) {
    el.style.outline = '2px solid red';

    const targetRect = this.targetEl.getBoundingClientRect();
    const componentRect = el.getBoundingClientRect();

    this.inspectorY = componentRect.top - targetRect.top;
    this.inspectorX = componentRect.left - targetRect.left;
    this.inspectorWidth = componentRect.width;
    this.inspectorHeight = componentRect.height;
  }

  private clearCanvasHighlight(el: HTMLElement) {
    el.style.outline = '';
  }

  private renderComponentsTab() {
    const { components } = this;
    return (
      <div class='explorer__elements'>
        {components && <app-tree
          node={components}
          onInspect={({ detail }) => this.inspect(detail)}
          onHighlightStart={({ detail }) => this.highlightCanvasEl(detail)}
          onHighlightEnd={({ detail }) => this.clearCanvasHighlight(detail)}></app-tree>}
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
    const { cssShadowParts, hoveredShadowPart, activeShadowPart } = this;
    return (
      <section id='css-shadow-parts'>
        <app-knob-css-shadow-part-list
          items={cssShadowParts}
          hoveredPartEl={hoveredShadowPart}
          activePartEl={activeShadowPart}
        ></app-knob-css-shadow-part-list>
      </section>
    )
  }

  render() {
    const { inspectorHeight, inspectorWidth, inspectorX, inspectorY } = this;
    return (
      <Host>
        <div class='explorer__tabs'>
          <div class='explorer__tab-bar'>
            <app-tab-button active={true}>{this.i18n.canvas}</app-tab-button>
            <span class='explorer__tab-separator'></span>
            <button
              class='explorer__tab-control'
              type='button'
              aria-label={this.i18n.zoom_in}
              onClick={() => this.canvasZoomIn()}>
              <ZoomInIcon />
            </button>
            <button
              class='explorer__tab-control'
              type='button'
              aria-label={this.i18n.zoom_out}
              onClick={() => this.canvasZoomOut()}>
              <ZoomOutIcon />
            </button>
            <button
              class='explorer__tab-control'
              type='button'
              aria-label={this.i18n.zoom_reset}
              onClick={() => this.setZoom(100)}>
              <ZoomResetIcon />
            </button>
          </div>
          <div class='explorer__tab-content'>
            <div class='explorer__canvas' id='explorer-component' style={{
              zoom: `${this.zoomFactor}%`
            }}>
              {this.frameSrc ? (<iframe
                ref={ref => this.frameEl = ref}
                class='explorer__canvas-frame' src={this.frameSrc}></iframe>) : (<slot />)}
              <div class='explorer__canvas-inspector' style={{
                width: `${inspectorWidth}px`,
                height: `${inspectorHeight}px`,
                transform: `translate(${Math.round(inspectorX)}px,${Math.round(inspectorY)}px)`
              }}></div>
            </div>
          </div>
        </div>
        <div class='explorer__tabs'>
          <div class='explorer__tab-bar'>
            <div role='tablist'>
              <app-tab-button
                active={this.activeTabIndex === 0}
                index={0}
                onTabChange={this.activeTabChange}>{this.i18n.component_explorer}</app-tab-button>
              <app-tab-button
                active={this.activeTabIndex === 1}
                index={1}
                onTabChange={this.activeTabChange}>{this.i18n.css_variables}</app-tab-button>
              <app-tab-button
                active={this.activeTabIndex === 2}
                index={2}
                onTabChange={this.activeTabChange}>{this.i18n.css_shadow_parts}</app-tab-button>
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
      </Host>
    )
  }

}
