import { Component, h, Host, Prop } from "@stencil/core";


@Component({
  tag: 'app-knob-css-shadow-part-list',
  styleUrl: 'knob-css-shadow-part-list.css',
  shadow: true
})
export class KnobCssShadowPartList {
  /**
   * The list of shadow part elements.
   */
  @Prop() items: HTMLElement[] = [];
  /**
   * The hovered element in the explorer that matches a shadow part.
   */
  @Prop() hoveredPartEl: HTMLElement;
  /**
   * The active element selected that contains a shadow part.
   */
  @Prop() activePartEl: HTMLElement;

  @Prop() i18n = {
    no_results: 'No shadow parts detected for the inspected element.'
  }

  private renderShadowParts() {
    const { items } = this;

    if (!items || items.length < 1) {
      return (
        <p class='knob__placeholder-text'>{this.i18n.no_results}</p>
      );
    }
    return (
      <div>
        {
          items.map(shadowPart => (
            <li>
              <label>{shadowPart.getAttribute('part')}</label>
            </li>
          ))
        }
      </div>
    );
  }

  private renderHoveredPartEl() {
    const { hoveredPartEl } = this;
    if (!hoveredPartEl) {
      return null;
    }
    return [
      <h4>Hovered Shadow Part</h4>,
      <ul>
        <pre>{hoveredPartEl.outerHTML}</pre>
      </ul>
    ];
  }

  private renderActivePartEl() {
    const { activePartEl } = this;
    if (!activePartEl) {
      return null;
    }
    return [
      <h4>Selected Shadow Part</h4>,
      <ul>
        <pre>{activePartEl.outerHTML}</pre>
      </ul>
    ]
  }

  render() {
    return (
      <Host>
        {this.renderShadowParts()}
        {this.renderHoveredPartEl()}
        {this.renderActivePartEl()}
      </Host>
    )
  }

}
