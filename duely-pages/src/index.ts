import { html, css, LitElement, ReactiveController, ReactiveControllerHost } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('d-root')
export class DRoot extends LitElement {
  constructor() {
    super();
    this.#mutationObserver = new MutationObserver(this.#mutationObserverCallback);
  }

  #mutationObserver: MutationObserver;

  @property()
  name = 'Somebody';

  #mutationObserverCallback(mutationList: MutationRecord[]) {
    console.log(mutationList);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#mutationObserver.observe(this, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#mutationObserver.disconnect();
  }

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

// TODO:
@customElement('d-formfield')
export class DFormField extends LitElement {
  constructor() {
    super();
  }

  @property()
  name?: string;

  @property()
  form?: string;

  @property()
  type?: string = 'text';

  connectedCallback(): void {
    super.connectedCallback();
    console.log(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  render() {
    return html` <input id="${this.name}" name="${this.name}" form="${this.form}" /> `;
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
