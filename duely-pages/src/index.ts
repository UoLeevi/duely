import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('d-root')
export class DRoot extends LitElement {
  @property()
  name = 'Somebody';

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
