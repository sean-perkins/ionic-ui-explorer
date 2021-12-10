import { Component, Event, h, Listen, EventEmitter, Prop } from "@stencil/core";


@Component({
  tag: 'app-tab-button',
  styleUrl: 'tab-button.css',
  shadow: true
})
export class TabButton {
  /**
   * `true` if the tab button is disabled from selection.
   */
  @Prop() disabled = false;

  @Prop() index: number;

  @Prop({ reflect: true }) active: boolean;

  @Event() tabChange: EventEmitter<number>;

  @Listen('click')
  onclick() {
    const { disabled, index } = this;
    if (disabled) {
      return;
    }
    this.tabChange.emit(index);
  }

  render() {
    return (
      <button type='button' role='tab' disabled={this.disabled}>
        <slot />
      </button>
    )
  }

}
