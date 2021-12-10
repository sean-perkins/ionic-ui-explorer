import { Component, Host, Prop, h, Event, EventEmitter } from "@stencil/core";


@Component({
  tag: 'app-knob-css-variable-list',
  styleUrl: 'knob-css-variable-list.css',
  shadow: true,
})
export class KnobCssVariableList {
  /**
   * The list of CSS variable name/value pairs.
   */
  @Prop() items: string[][] = [];

  @Prop() i18n = {
    name: 'Name',
    value: 'Value',
    no_results: 'No CSS variables detected for the inspected element.'
  }

  /**
   * Emitted when the input control for the CSS variable has
   * a new value.
   */
  @Event() variableChange: EventEmitter<{
    name: string;
    value: string;
  }>;

  private valueChange(ev: Event, variableName: string) {
    const newValue = (ev.target as HTMLInputElement).value;
    this.variableChange.emit({
      name: variableName,
      value: newValue
    });
  }

  render() {
    const { items } = this;
    return (
      <Host>
        <div class='knob-variable-list'>
          <div class='knob__header'>
            <div class='knob__header-text'>{this.i18n.name}</div>
            <div class='knob__header-text'>{this.i18n.value}</div>
          </div>
          {items.length === 0 && (
            <p class='knob__placeholder-text'>{this.i18n.no_results}</p>
          )}
          {items.map(cssVariable => {
            const inputId = `input-${cssVariable[0]}`;
            return (
              <div class='knob-variable'>
                <label htmlFor={inputId}>{cssVariable[0]}</label>
                <input
                  id={inputId}
                  type='text'
                  value={cssVariable[1]}
                  onChange={ev => this.valueChange(ev, cssVariable[0])} />
              </div>
            )
          })}
        </div>
      </Host>
    )
  }

}
