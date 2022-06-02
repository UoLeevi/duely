import { html, css, LitElement, ReactiveController, ReactiveControllerHost } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('d-root')
export class DRoot extends LitElement {
  @property()
  name = 'Somebody';

  render() {
    return html`<slot></slot>`;
  }
}

// TODO:
@customElement('d-form')
export class DForm extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <form id="${this.id}">
        <slot></slot>
      </form>
    `;
  }
}

export class FormController implements ReactiveController {
  host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost, form: string) {
    (this.host = host).addController(this);
  }
  hostConnected() {}
  hostDisconnected() {}
}
