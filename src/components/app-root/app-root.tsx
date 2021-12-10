import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  render() {
    return (
      <div>
        <main>
          <app-explorer>
            <ion-list inset={true}>
              <ion-list-header>Basic</ion-list-header>
              <ion-accordion-group>
                <ion-accordion value="colors">
                  <ion-item slot="header" color="primary">
                    <ion-label>Colors</ion-label>
                  </ion-item>

                  <ion-list slot="content">
                    <ion-item>
                      <ion-label>Red</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-label>Green</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-label>Blue</ion-label>
                    </ion-item>
                  </ion-list>
                </ion-accordion>
                <ion-accordion value="shapes">
                  <ion-item slot="header" color="success">
                    <ion-label>Shapes</ion-label>
                  </ion-item>

                  <ion-list slot="content">
                    <ion-item>
                      <ion-label>Circle</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-label>Triangle</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-label>Square</ion-label>
                    </ion-item>
                  </ion-list>
                </ion-accordion>
                <ion-accordion value="numbers">
                  <ion-item slot="header" color="danger">
                    <ion-label>Numbers</ion-label>
                  </ion-item>

                  <ion-list slot="content">
                    <ion-item>
                      <ion-label>1</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-label>2</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-label>3</ion-label>
                    </ion-item>
                  </ion-list>
                </ion-accordion>
              </ion-accordion-group>
            </ion-list>
          </app-explorer>
        </main>
      </div>
    );
  }
}
