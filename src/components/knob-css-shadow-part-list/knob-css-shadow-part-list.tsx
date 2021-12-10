import { Component, h, Host, Prop } from "@stencil/core";


@Component({
  tag: 'app-knob-css-shadow-part-list',
  shadow: true
})
export class KnobCssShadowPartList {

  @Prop() items: HTMLElement[] = [];

  render() {
    return (
      <Host>
        <h4>Detected CSS Shadow Parts</h4>
        <div>
          {
            this.items.map(shadowPart => (
              <li>
                <label>{shadowPart.getAttribute('part')}</label>
              </li>
            ))
          }
        </div>
      </Host>
    )
  }

}
