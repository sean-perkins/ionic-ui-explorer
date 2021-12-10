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
  /**
   * The numeric index/value of the tab button.
   */
  @Prop() index: number;
  /**
   * `true` if the tab button is active with a selected display.
   */
  @Prop({ reflect: true }) active: boolean;

  /**
   * Emitted when an enabled tab button is selected.
   */
  @Event() tabChange: EventEmitter<number>;

  @Listen('click')
  onclick() {
    const { disabled, index, active } = this;
    if (disabled || active) {
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
