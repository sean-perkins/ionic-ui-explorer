import { Component, Host, Prop, h, Event, EventEmitter } from "@stencil/core";


@Component({
  tag: 'app-knob-css-variable-list',
  shadow: true,
  styleUrl: 'knob-css-variable-list.css'
})
export class KnobCssVariableList {

  @Prop() items: string[][] = [];

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
            <div class='knob__header-text'>Name</div>
            <div class='knob__header-text'>Value</div>
          </div>
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
