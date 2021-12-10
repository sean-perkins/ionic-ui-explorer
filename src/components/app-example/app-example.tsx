import { Component, Host, h } from "@stencil/core";


@Component({
  tag: 'app-example',
  styleUrl: './app-example.css',
  shadow: true
})
export class AppExample {

  render() {
    return (
      <Host>
        <p>Example Web Component</p>
        <div>
          <h3 part='header'>I am a shadow part</h3>
          <p part='description'>I am a shadow part</p>
        </div>
      </Host>
    )
  }
}
