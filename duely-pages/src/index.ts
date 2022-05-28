class DuelyRoot extends HTMLElement {
  constructor() {
    super();

    // const shadow = this.attachShadow({ mode: 'open' });
    console.log("test");
    this.innerText = "test";
  }
}

customElements.define('d-root', DuelyRoot);
